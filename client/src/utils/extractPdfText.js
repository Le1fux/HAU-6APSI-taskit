import * as pdfjsLib from 'pdfjs-dist'

const MAX_PAGES = 30
const MAX_CHARACTERS = 15_000
const LINE_POSITION_TOLERANCE = 2
const PAGE_OF_PATTERN = /page\s+\d+\s+of\s+\d+/i

function buildLines(items) {
  const positionedItems = items
    .filter((item) => typeof item.str === 'string' && item.str.trim())
    .map((item, index) => ({
      text: item.str,
      x: item.transform?.[4] ?? 0,
      y: item.transform?.[5] ?? 0,
      width: item.width ?? 0,
      fontHeight: item.height || Math.hypot(item.transform?.[2] ?? 0, item.transform?.[3] ?? 0) || 1,
      index,
    }))
    .sort((left, right) => right.y - left.y || left.x - right.x || left.index - right.index)
  const groups = []

  for (const item of positionedItems) {
    let group = groups[groups.length - 1]
    if (!group || Math.abs(group.y - item.y) > LINE_POSITION_TOLERANCE) {
      group = { y: item.y, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }

  return groups.map((group) => {
    const lineItems = group.items.sort((left, right) => left.x - right.x || left.index - right.index)
    let line = ''
    let previous = null

    for (const item of lineItems) {
      if (previous) {
        const gap = item.x - (previous.x + previous.width)
        const spaceThreshold = Math.max(previous.fontHeight, item.fontHeight) * 0.15
        if (gap > spaceThreshold && !line.endsWith(' ')) line += ' '
      }
      line += item.text
      previous = item
    }

    return line.replace(/\s+/g, ' ').trim()
  }).filter((line) => line && !PAGE_OF_PATTERN.test(line))
}

function isPageNumber(line) {
  return /^(?:page\s+)?\d+(?:\s*(?:of|\/)\s*\d+)?\.?$/i.test(line.trim())
}

function normalizedLine(line) {
  return line.toLowerCase().replace(/\s+/g, ' ').trim()
}

// Extracts text from every page of a PDF file in the browser.
export default async function extractPdfText(file, onProgress) {
  globalThis.pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs')
  const loadingTask = pdfjsLib.getDocument({ data: await file.arrayBuffer() })

  try {
    const pdf = await loadingTask.promise
    const pages = []
    const totalPages = Math.min(pdf.numPages, MAX_PAGES)
    let characterCount = 0

    for (let pageNumber = 1; pageNumber <= totalPages && characterCount < MAX_CHARACTERS; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      let lines
      try {
        const textContent = await page.getTextContent()
        lines = buildLines(textContent.items).filter((line) => !isPageNumber(line))
      } finally {
        page.cleanup()
      }

      const acceptedLines = []
      for (const line of lines) {
        const remaining = MAX_CHARACTERS - characterCount
        if (remaining <= 0) break
        const acceptedLine = line.slice(0, remaining)
        acceptedLines.push(acceptedLine)
        characterCount += acceptedLine.length
      }
      pages.push(acceptedLines)
      onProgress?.(pageNumber, totalPages)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }

    const repeatedLines = new Set()
    if (pages.length > 1) {
      const pageOccurrences = new Map()
      for (const pageLines of pages) {
        for (const key of new Set(pageLines.map(normalizedLine))) {
          pageOccurrences.set(key, (pageOccurrences.get(key) || 0) + 1)
        }
      }
      for (const [line, count] of pageOccurrences) {
        if (count > 1) repeatedLines.add(line)
      }
    }

    const cleanedPages = pages.map((pageLines) => pageLines
      .filter((line) => !repeatedLines.has(normalizedLine(line)))
      .join('\n')
      .replace(/-\n(?=[a-z])/gi, '')
      .replace(/[ \t]+\n/g, '\n')
      .trim())
    const text = cleanedPages.filter(Boolean).join('\n').trim()
    if (text.length < 100) throw new Error('This PDF looks scanned or has no readable text.')
    return text
  } finally {
    await loadingTask.destroy()
  }
}