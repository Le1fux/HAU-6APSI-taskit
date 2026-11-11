import accountingReviewer from './reviewers/accounting.js'
import businessFundamentalsReviewer from './reviewers/businessFundamentals.js'
import cpaleReviewers from './reviewers/cpaleSubjects.js'
import economicsReviewer from './reviewers/economics.js'

const builtInReviewers = [
  ...cpaleReviewers,
  businessFundamentalsReviewer,
  accountingReviewer,
  economicsReviewer,
]

export function getBuiltInMaterials() {
  return builtInReviewers.map((reviewer) => reviewer.toMaterial())
}

export function getBuiltInMaterial(id) {
  const reviewer = builtInReviewers.find((item) => item.id === String(id))
  return reviewer ? reviewer.toMaterial() : null
}

export function getBuiltInQuestions(id) {
  const reviewer = builtInReviewers.find((item) => item.id === String(id))
  return reviewer ? reviewer.getQuestions() : []
}
