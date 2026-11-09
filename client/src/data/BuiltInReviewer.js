function cloneEntries(entries) {
  return entries.map((entry) => ({
    ...entry,
    ...(entry.sourceIds ? { sourceIds: [...entry.sourceIds] } : {}),
    ...(entry.options ? { options: [...entry.options] } : {}),
  }))
}

export default class BuiltInReviewer {
  constructor({
    id,
    title,
    course,
    isBuiltIn = true,
    content,
    sources = [],
    summary = [],
    findings = [],
    keyTerms = [],
    questions = [],
  }) {
    this.id = id
    this.title = title
    this.course = course
    this.isBuiltIn = isBuiltIn
    this.content = content
    this.sources = sources
    this.summary = summary
    this.findings = findings
    this.keyTerms = keyTerms
    this.questions = questions
  }

  toMaterial() {
    return {
      ...this,
      sources: cloneEntries(this.sources),
      summary: cloneEntries(this.summary),
      findings: cloneEntries(this.findings),
      keyTerms: cloneEntries(this.keyTerms),
      questions: cloneEntries(this.questions),
    }
  }

  getQuestions() {
    const questions = [...this.questions].sort((left, right) =>
      Number(Array.isArray(right.options)) - Number(Array.isArray(left.options))
    )
    return questions.map((question, index) => ({
      ...question,
      ...(question.sourceIds ? { sourceIds: [...question.sourceIds] } : {}),
      ...(question.options ? { options: [...question.options] } : {}),
      id: `${this.id}-${index + 1}`,
      materialId: this.id,
      sources: cloneEntries(this.sources),
    }))
  }
}
