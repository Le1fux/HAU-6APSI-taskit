const FALLBACK_QUESTIONS = [
  {
    question: 'What is the central idea in this material?',
    answer: 'Explain the main subject or process described in the material.',
  },
  {
    question: 'Which detail best supports that idea?',
    answer: 'Choose a specific detail from the material that supports its central idea.',
  },
  {
    question: 'How would you explain this to someone else?',
    answer: 'Summarize the main idea and connect it to a supporting detail.',
  },
]

export function getFallbackQuestions(materialId) {
  return FALLBACK_QUESTIONS.map((question, index) => ({
    ...question,
    id: `fallback-${materialId}-${index + 1}`,
    materialId: String(materialId),
  }))
}
