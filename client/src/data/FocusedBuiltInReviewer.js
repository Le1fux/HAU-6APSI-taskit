import BuiltInReviewer from './BuiltInReviewer.js'

export default class FocusedBuiltInReviewer extends BuiltInReviewer {
  constructor({ baseReviewer, source, description, ...attributes }) {
    const material = baseReviewer.toMaterial()
    const usesSource = (item) => item.sourceIds?.includes(source.id)

    super({
      ...material,
      ...attributes,
      content: description,
      sources: [source],
      summary: material.summary.filter(usesSource),
      findings: material.findings.filter(usesSource),
      keyTerms: material.keyTerms.filter(usesSource),
      questions: material.questions.filter(usesSource),
    })
  }
}
