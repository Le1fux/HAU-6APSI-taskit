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
    const label = match?.[1].trim().toLowerCase()
    if (!match || GENERIC_LABELS.has(label) || METADATA_LABELS.has(label)) return []
    return [{ statement: match[1].trim(), explanation: match[2].trim() }]
  })
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

function makeSentenceSummary(text) {
  const sentences = uniqueByLetters(text.split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 40 && sentence.length <= 350))
  const frequency = new Map()
  for (const word of wordsIn(text)) {
    if (word.length >= 4 && !STOP_WORDS.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
  }

  const rankedSentences = sentences.map((sentence, index) => {
    const terms = new Set(wordsIn(sentence).filter((word) => word.length >= 4 && !STOP_WORDS.has(word)))
    return {
      sentence,
      index,
      terms,
      score: terms.size
        ? [...terms].reduce((total, word) => total + Math.log1p(frequency.get(word) || 0), 0) / Math.sqrt(terms.size)
        : 0,
    }
  }).sort((left, right) => right.score - left.score || left.index - right.index)

  const selected = []
  const coveredTerms = new Set()
  for (const candidate of rankedSentences) {
    if (candidate.terms.size < 3) continue
    const overlap = [...candidate.terms].filter((word) => coveredTerms.has(word)).length / candidate.terms.size
    if (overlap > 0.65) continue
    selected.push(candidate)
    for (const word of candidate.terms) coveredTerms.add(word)
    if (selected.length === 6) break
  }

  return selected.sort((left, right) => left.index - right.index)
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
    summary = facts.map(({ statement, explanation }) =>
      trimText(`${statement}: ${explanation}`, 200)
    ).slice(0, 10)
  } else {
    summary = makeSentenceSummary(cleanText)
  }

  const questions = pairedFacts.length ? makeFactQuestions(facts) : makeLabeledFactQuestions(facts)
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