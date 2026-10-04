const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
  'have', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'their',
  'this', 'to', 'was', 'were', 'which', 'with',
])
const GENERIC_LABELS = new Set([
  'explanation', 'fact', 'note', 'notes', 'example', 'answer', 'summary', 'tip', 'question',
])

function wordsIn(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || []
}

function lettersOnlyKey(text) {
  return text.toLowerCase().replace(/[^a-z]/g, '')
}

function trimText(text, maxLength) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  const limit = maxLength - 3
  const lastSpace = clean.slice(0, limit + 1).lastIndexOf(' ')
  return `${clean.slice(0, lastSpace > 0 ? lastSpace : limit).trim()}...`
}

function uniqueByLetters(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = lettersOnlyKey(item)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Pairs each numbered fact statement with its following explanation line.
function parseFactPairs(lines) {
  const facts = []
  for (let index = 0; index < lines.length - 1; index += 1) {
    const factMatch = lines[index].match(/^Fact\s+\[?\d+\]?\s+(.+)$/i)
    const explanationMatch = lines[index + 1].match(/^Explanation\s*:\s*(.+)$/i)
    if (!factMatch || !explanationMatch) continue

    const statement = factMatch[1].replace(/[.:;]+$/, '').trim()
    const explanation = explanationMatch[1].trim()
    if (statement && explanation) facts.push({ statement, explanation })
    index += 1
  }
  return facts
}

// Accepts specific colon-label facts but excludes headings and generic labels.
function parseLabeledFacts(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^([A-Za-z][A-Za-z0-9+/#() _-]{0,39}):\s*(.+)$/)
    if (!match || GENERIC_LABELS.has(match[1].trim().toLowerCase())) return []
    return [{ statement: match[1].trim(), explanation: match[2].trim() }]
  })
}

function deduplicateFacts(facts) {
  const seen = new Set()
  return facts.filter(({ statement }) => {
    const key = lettersOnlyKey(statement)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function firstKeyTerm(statement) {
  const acronym = statement.match(/\b[A-Z][A-Z0-9]{1,}\b/)
  if (acronym) return acronym[0]
  const tokens = statement.match(/[A-Za-z][A-Za-z0-9]*/g) || []
  return tokens.find((word) => word.length >= 6 && !STOP_WORDS.has(word.toLowerCase()))
}

function makeFactQuestions(facts) {
  const questions = []
  for (const fact of facts) {
    if (questions.length >= 10) break
    if (fact.explanation.length < 20) continue

    if (questions.length % 2 === 0) {
      const keyTerm = firstKeyTerm(fact.statement)
      if (keyTerm) {
        const blanked = fact.statement.replace(new RegExp(`\\b${keyTerm}\\b`, 'i'), '_____')
        questions.push({ question: `Complete the fact: ${blanked}`, answer: `${keyTerm}: ${fact.explanation}` })
        continue
      }
    }

    questions.push({ question: `Explain: ${fact.statement}`, answer: fact.explanation })
  }
  return questions
}

function makeSentenceSummary(text) {
  const sentences = uniqueByLetters(text.split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 40 && sentence.length <= 300))
  const frequency = new Map()
  for (const word of wordsIn(text)) {
    if (!STOP_WORDS.has(word)) frequency.set(word, (frequency.get(word) || 0) + 1)
  }

  return sentences.map((sentence, index) => ({
    sentence,
    index,
    score: wordsIn(sentence).reduce((total, word) => total + (STOP_WORDS.has(word) ? 0 : frequency.get(word) || 0), 0),
  }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 8)
    .sort((left, right) => left.index - right.index)
    .map(({ sentence }) => trimText(sentence, 200))
}

// Builds a local reviewer without external services.
export function buildReviewer(text, fileName) {
  if (typeof text !== 'string' || text.trim().length < 100) {
    return { error: 'Not enough readable content.' }
  }

  const lines = text.split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line && !/page\s+\d+\s+of\s+\d+/i.test(line))
  const cleanText = lines.join(' ')
  const title = (fileName || 'Study notes').replace(/\.pdf$/i, '').replace(/\s+/g, ' ').trim()
  const pairedFacts = deduplicateFacts(parseFactPairs(lines))
  const facts = pairedFacts.length ? pairedFacts : deduplicateFacts(parseLabeledFacts(lines))

  let summary
  if (pairedFacts.length) {
    summary = pairedFacts.map(({ statement }) => trimText(statement, 160)).slice(0, 10)
  } else if (facts.length) {
    summary = facts.map(({ statement }) => trimText(statement, 160)).slice(0, 10)
  } else {
    summary = makeSentenceSummary(cleanText)
  }

  const questions = makeFactQuestions(facts)
  if (facts.length === 0) {
    for (const sentence of makeSentenceSummary(cleanText)) {
      if (questions.length >= 10) break
      const keyTerm = firstKeyTerm(sentence)
      if (!keyTerm) continue
      const blanked = sentence.replace(new RegExp(`\\b${keyTerm}\\b`, 'i'), '_____')
      const answer = `${keyTerm}: ${sentence}`
      if (answer.length >= 20) questions.push({ question: `Complete the fact: ${blanked}`, answer })
    }
  }

  return { title, summary, questions: questions.slice(0, 10) }
}

export default buildReviewer