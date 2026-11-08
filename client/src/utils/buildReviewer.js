const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
  'have', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'their',
  'this', 'to', 'was', 'were', 'which', 'with',
])
const GENERIC_LABELS = new Set([
  'explanation', 'fact', 'note', 'notes', 'example', 'answer', 'summary', 'tip', 'question',
])
const METADATA_LABELS = new Set(['presented by', 'source', 'page number'])

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
    const factMatch = lines[index].match(/^Fact\s+\[?\d+\]?\s*:?\s*(.+)$/i)
    const explanationMatch = lines[index + 1].match(/^Explanation\s*:\s*(.+)$/i)
    if (!factMatch || !explanationMatch) continue

    const statement = factMatch[1].replace(/[.:;]+$/, '').trim()
    const explanation = explanationMatch[1].trim()
    if (statement && explanation) facts.push({ statement, explanation })
    index += 1
  }
  return facts
}

function parseNumberedFacts(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^Fact\s+\[?\d+\]?\s*:\s*(.+)$/i)
    return match ? [{ statement: match[1].trim(), explanation: '' }] : []
  })
}

// Accepts specific colon-label facts but excludes headings and generic labels.
function parseLabeledFacts(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^([A-Za-z][A-Za-z0-9+/#() _-]{0,39}):\s*(.+)$/)
    const label = match?.[1].trim().toLowerCase()
    if (!match || GENERIC_LABELS.has(label) || METADATA_LABELS.has(label)) return []
    return [{ statement: match[1].trim(), explanation: match[2].trim() }]
  })
}

function findExplicitTerms(text) {
  const terms = []
  const namedTerms = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\s+\([A-Z][A-Z0-9]{1,}\)|[A-Z][A-Z0-9]{1,})/g
  for (const match of text.matchAll(namedTerms)) {
    const term = match[1].trim().replace(/^(?:A|An|The)\s+/, '')
    if (/^[A-Z][A-Z0-9]{1,}$/.test(term) && terms.some((existing) => existing.endsWith(`(${term})`))) {
      continue
    }
    if (!terms.includes(term)) terms.push(term)
  }
  return terms
}

function getSentences(text) {
  return uniqueByLetters(text.split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 25 && sentence.length <= 350))
}

function extractProseTerms(sentences) {
  const terms = []
  const genericSubjects = new Set([
    'it', 'this', 'that', 'these', 'those', 'they', 'there', 'the process',
    'this process', 'the system', 'this system', 'the result', 'this result',
  ])
  const acronymPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\s+\([A-Z][A-Z0-9]{1,}\))/g

  for (const sentence of sentences) {
    for (const match of sentence.matchAll(acronymPattern)) {
      const term = match[1].replace(/^(?:A|An|The)\s+/, '')
      terms.push({ term, definition: sentence, sourceText: sentence })
    }

    const definition = sentence.match(/^(.{2,60}?)\s+(?:is|are|means|refers to)\s+(.+?)[.!?]?$/i)
    if (definition) {
      const term = definition[1].trim().replace(/^(?:A|An|The)\s+/, '')
      const normalizedTerm = term.toLowerCase()
      if (
        term.split(/\s+/).length <= 6 &&
        !/\([A-Z][A-Z0-9]{1,}\)/.test(term) &&
        !genericSubjects.has(normalizedTerm) &&
        !/^(?:it|this|that|these|those|they|there)\b/i.test(term)
      ) {
        terms.push({
          term,
          definition: definition[2].trim(),
          sourceText: sentence,
        })
      }
    }
  }

  return terms
}

function deduplicateFacts(facts) {
  const seen = new Set()
  return facts.filter(({ statement }) => {
    const key = statement.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function makeLabeledFactQuestions(facts) {
  const questions = []

  for (const fact of facts) {
    const label = fact.statement.toLowerCase()
    let question

    if (label === 'word of the day') {
      question = 'Which word is featured as the word of the day?'
    } else if (/^meaning(?:\s+\d+)?$/.test(label)) {
      const number = Number(label.match(/\d+/)?.[0])
      const ordinal = ['first', 'second', 'third', 'fourth', 'fifth'][number - 1]
      question = ordinal
        ? `What is the ${ordinal} meaning of the word of the day?`
        : 'What does the word of the day mean?'
    } else if (/^sentence(?:\s+\d+)?$/.test(label)) {
      question = 'Which sentence shows the word of the day in use?'
    } else if (label === 'part of speech') {
      question = 'What part of speech is the word of the day?'
    } else if (fact.explanation.length >= 20) {
      question = `What is ${fact.statement.toLowerCase()}?`
    }

    if (question && fact.explanation.length >= 2) {
      questions.push({ question, answer: fact.explanation })
    }
    if (questions.length >= 10) break
  }

  return questions
}

function makeSentenceQuestions(sentences) {
  const questions = []
  const seen = new Set()
  const baseVerbs = {
    'breaks down': 'break down',
    'break down': 'break down',
    causes: 'cause',
    cause: 'cause',
    connects: 'connect',
    connect: 'connect',
    contains: 'contain',
    contain: 'contain',
    converts: 'convert',
    convert: 'convert',
    defines: 'define',
    define: 'define',
    absorbs: 'absorb',
    absorb: 'absorb',
    enters: 'enter',
    enter: 'enter',
    encrypts: 'encrypt',
    encrypt: 'encrypt',
    forwards: 'forward',
    forward: 'forward',
    identifies: 'identify',
    identify: 'identify',
    includes: 'include',
    include: 'include',
    increases: 'increase',
    increase: 'increase',
    decreases: 'decrease',
    decrease: 'decrease',
    learns: 'learn',
    learn: 'learn',
    moves: 'move',
    move: 'move',
    produces: 'produce',
    produce: 'produce',
    provides: 'provide',
    provide: 'provide',
    receives: 'receive',
    receive: 'receive',
    releases: 'release',
    release: 'release',
    requires: 'require',
    require: 'require',
    sends: 'send',
    send: 'send',
    stores: 'store',
    store: 'store',
    translates: 'translate',
    translate: 'translate',
    uses: 'use',
    use: 'use',
    'depends on': 'depend on',
    'depend on': 'depend on',
  }
  const actionPattern = new RegExp(
    `^(.+?)\\s+(${Object.keys(baseVerbs)
      .sort((left, right) => right.length - left.length)
      .map((verb) => verb.replace(/\s+/g, '\\s+'))
      .join('|')})\\s+(.+)[.!?]?$`,
    'i'
  )

  function lowerInitial(text) {
    const firstWord = text.match(/^\S+/)?.[0] || ''
    if (/^[A-Z0-9]{2,}$/.test(firstWord)) return text
    return text ? `${text[0].toLowerCase()}${text.slice(1)}` : text
  }

  function auxiliaryFor(subject) {
    const lastWord = subject.split(/\s+/).pop().toLowerCase()
    return lastWord.endsWith('s') && !/(?:ics|is|ness|ous|sis|ss|us)$/i.test(lastWord)
      ? 'do'
      : 'does'
  }

  for (const item of sentences) {
    const sentence = typeof item === 'string' ? item : item.statement
    const explanation = typeof item === 'string' ? '' : item.explanation
    const cleanSentence = sentence.replace(/[.!?]+$/, '').trim()
    const definition = cleanSentence.match(/^(.+?)\s+(?:is|are|means|refers to)\s+(.+)$/i)
    const action = cleanSentence.match(actionPattern)
    let question
    let answer

    if (definition) {
      const subject = definition[1]
      question = `What is ${lowerInitial(subject)}?`
      answer = explanation || definition[2]
    } else if (action) {
      const subject = action[1]
      const verb = action[2].toLowerCase()
      const object = action[3].replace(/(?:,\s*|\s+)(?:while|whereas|but)\b.*$/i, '').trim()
      if ((verb === 'enters' || verb === 'enter') && /^(?:through|via|into|from)\b/i.test(object) && !explanation) {
        question = `Where does ${lowerInitial(subject)} enter?`
        answer = object
      } else if (explanation) {
        if (/^(?:it|they|this|these|those)\s+(?:can|may|might|could|will|would)\b/i.test(explanation)) {
          question = `What can happen when ${lowerInitial(subject)} ${verb} ${object}?`
        } else {
          const auxiliary = auxiliaryFor(subject)
          question = `How ${auxiliary} ${lowerInitial(subject)} ${baseVerbs[verb]} ${object}?`
        }
        answer = explanation
      } else {
        const auxiliary = auxiliaryFor(subject)
        question = `What ${auxiliary} ${lowerInitial(subject)} ${baseVerbs[verb]}?`
        answer = object
      }
    } else {
      continue
    }

    const key = question.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ question, answer: answer.replace(/[.!?]+$/, ''), sourceText: sentence })
    if (questions.length === 10) break
  }

  return questions
}

function makeSentenceSummary(text) {
  const sentences = getSentences(text)
  const frequency = new Map()
  const sentenceFrequency = new Map()
  for (const word of wordsIn(text)) {
    if (word.length >= 4 && !STOP_WORDS.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
  }

  for (const sentence of sentences) {
    const terms = new Set(wordsIn(sentence).filter((word) => word.length >= 4 && !STOP_WORDS.has(word)))
    for (const term of terms) {
      sentenceFrequency.set(term, (sentenceFrequency.get(term) || 0) + 1)
    }
  }

  const rankedSentences = sentences.map((sentence, index) => {
    const terms = new Set(wordsIn(sentence).filter((word) => word.length >= 4 && !STOP_WORDS.has(word)))
    const centrality = [...terms].reduce((total, word) => {
      const prevalence = sentenceFrequency.get(word) || 1
      return total + Math.log1p(frequency.get(word) || 0) * Math.log1p(sentences.length / prevalence)
    }, 0)
    return {
      sentence,
      index,
      terms,
      score: terms.size
        ? centrality / Math.sqrt(terms.size) * (index === 0 ? 1.15 : 1)
        : 0,
    }
  }).sort((left, right) => right.score - left.score || left.index - right.index)

  const selected = []
  const coveredTerms = new Set()
  for (const candidate of rankedSentences) {
    const novelty = [...candidate.terms].filter((word) => !coveredTerms.has(word)).length
    if (candidate.terms.size < 2 && sentences.length > 1) continue
    if (selected.length && novelty === 0) continue
    const overlap = candidate.terms.size ? 1 - novelty / candidate.terms.size : 1
    if (overlap > 0.75) continue
    selected.push(candidate)
    for (const word of candidate.terms) coveredTerms.add(word)
    if (selected.length === 6) break
  }

  if (!selected.length && sentences.length) selected.push(rankedSentences[0])

  return selected.sort((left, right) => left.index - right.index)
    .map(({ sentence }) => sentence)
}

function getSourceLines(text) {
  let page = null
  const lines = []

  for (const rawLine of text.split(/\r?\n/)) {
    const pageMarker = rawLine.match(/^\s*\[\[PAGE\s+(\d+)\]\]\s*$/i)
    if (pageMarker) {
      page = Number(pageMarker[1])
      continue
    }
    const line = rawLine.replace(/\s+/g, ' ').trim()
    if (line && !/page\s+\d+\s+of\s+\d+/i.test(line)) lines.push({ text: line, page })
  }

  return lines
}

function sourceFor(text, sourceLines) {
  const query = text.replace(/\.\.\.$/, '').replace(/\s+/g, ' ').trim()
  if (!query) return { page: null, evidence: '' }

  const pattern = query.split(' ')
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+')
  const sources = [...sourceLines]
  const pageGroups = new Map()

  for (const source of sourceLines) {
    const group = pageGroups.get(source.page) || { page: source.page, text: [] }
    group.text.push(source.text)
    pageGroups.set(source.page, group)
  }
  sources.push(...[...pageGroups.values()].map(({ page, text: pageLines }) => ({
    page,
    text: pageLines.join(' '),
  })))

  for (const source of sources) {
    const match = source.text.match(new RegExp(pattern, 'i'))
    if (match) return { page: source.page, evidence: trimText(match[0], 280) }
  }
  return { page: null, evidence: '' }
}

// Builds a local reviewer without external services.
export function buildReviewer(text, fileName) {
  if (typeof text !== 'string' || text.trim().length < 100) {
    return { error: 'Not enough readable content.' }
  }

  const sourceLines = getSourceLines(text)
  const lines = sourceLines.map(({ text: line }) => line)
  const cleanText = lines.join(' ')
  const proseSentences = getSentences(cleanText)
  const title = (fileName || 'Study notes').replace(/\.pdf$/i, '').replace(/\s+/g, ' ').trim()
  const pairedFacts = deduplicateFacts(parseFactPairs(lines))
  const numberedFacts = pairedFacts.length ? pairedFacts : deduplicateFacts(parseNumberedFacts(lines))
  const labeledFacts = deduplicateFacts(parseLabeledFacts(lines))
    .filter(({ statement }) => !/^fact\s+\d+$/i.test(statement))
  const facts = pairedFacts.length
    ? pairedFacts
    : numberedFacts.length
      ? numberedFacts
      : labeledFacts

  let summary
  if (numberedFacts.length) {
    summary = numberedFacts.map(({ statement }) => trimText(statement, 160)).slice(0, 10)
  } else if (facts.length) {
    summary = facts.map(({ statement, explanation }) =>
      trimText(`${statement}: ${explanation}`, 200)
    ).slice(0, 10)
  } else {
    summary = makeSentenceSummary(cleanText)
  }

  let questions = pairedFacts.length
    ? makeSentenceQuestions(pairedFacts)
    : numberedFacts.length
      ? makeSentenceQuestions(numberedFacts)
      : facts.length
        ? makeLabeledFactQuestions(facts)
        : makeSentenceQuestions(proseSentences)

  const findings = summary.slice(0, 8).map((finding) => ({
    text: finding,
    ...sourceFor(finding, sourceLines),
  }))
  const explicitTerms = [
    ...labeledFacts.map(({ statement, explanation }) => ({
      term: statement,
      definition: explanation,
      sourceText: `${statement}: ${explanation}`,
    })),
    ...numberedFacts.flatMap(({ statement, explanation }) =>
      findExplicitTerms(statement).map((term) => ({
        term,
        definition: explanation && !/^(?:it|they|this|these|those)\b/i.test(explanation)
          ? explanation
          : statement,
        sourceText: statement,
      }))
    ),
    ...extractProseTerms(proseSentences),
  ]
  const expandedAcronyms = new Set(explicitTerms.flatMap(({ term }) => {
    const acronym = term.match(/\(([A-Z][A-Z0-9]{1,})\)$/)
    return acronym ? [acronym[1]] : []
  }))
  const seenTerms = new Set()
  const keyTerms = explicitTerms.filter(({ term }) => {
    if (/^[A-Z][A-Z0-9]{1,}$/.test(term) && expandedAcronyms.has(term)) return false
    const normalizedTerm = term.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!normalizedTerm || seenTerms.has(normalizedTerm)) return false
    seenTerms.add(normalizedTerm)
    return true
  }).slice(0, 8).map(({ sourceText, ...term }) => ({
    ...term,
    ...sourceFor(sourceText, sourceLines),
  }))
  questions = questions.slice(0, 10).map(({ sourceText, ...question }) => ({
    ...question,
    ...sourceFor(sourceText || question.answer, sourceLines),
  }))

  return { title, summary, findings, keyTerms, questions }
}

export default buildReviewer