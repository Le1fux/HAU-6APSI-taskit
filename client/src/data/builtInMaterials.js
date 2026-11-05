const businessBoardExamReviewer = {
  id: 'business-board-exam-sample',
  title: 'Business Board Exam Reviewer',
  course: 'Business Board Exam',
  isBuiltIn: true,
  content: 'An illustrative overview of accounting, economics, management, marketing, and finance concepts. This sample is for study practice and is not an official exam blueprint.',
  summary: [
    'The accounting equation, assets = liabilities + owners’ equity, describes how a business’s resources are financed.',
    'Financial statements present related views of performance, financial position, and cash movement over a defined period or date.',
    'Supply and demand describe how buyers’ willingness to purchase and sellers’ willingness to offer goods relate to market price and quantity.',
    'Management coordinates planning, organizing, leading, and controlling to pursue organizational objectives.',
    'Marketing connects customer needs with a product, price, place, and promotion strategy.',
  ],
  findings: [
    { text: 'The accounting equation remains balanced because each recorded transaction affects at least two accounts or account groupings.' },
    { text: 'Profit and cash flow are different measures: revenue and expenses determine profit, while cash flow tracks cash received and paid.' },
    { text: 'A change in demand or supply can affect a market’s equilibrium price and quantity; the direction depends on which curve shifts and how.' },
    { text: 'The marketing mix aligns product, price, place, and promotion decisions to serve a chosen target market.' },
  ],
  keyTerms: [
    { term: 'Assets', definition: 'Resources controlled by a business that are expected to provide future economic benefit.' },
    { term: 'Liabilities', definition: 'Obligations of a business to transfer resources or provide services in the future.' },
    { term: 'Owners’ equity', definition: 'The residual interest in a business’s assets after liabilities are deducted.' },
    { term: 'Cash flow', definition: 'The movement of cash into and out of a business during a period.' },
    { term: 'Market equilibrium', definition: 'A market condition where quantity supplied equals quantity demanded at a given price.' },
    { term: 'Marketing mix', definition: 'The coordinated set of product, price, place, and promotion decisions.' },
  ],
  questions: [
    { question: 'State the basic accounting equation and explain what owners’ equity represents.', answer: 'Assets = liabilities + owners’ equity. Owners’ equity is the residual interest in assets after liabilities are deducted.' },
    { question: 'Why can a business report a profit while experiencing a cash shortage?', answer: 'Profit is based on revenue and expenses, while cash flow records cash receipts and payments. The timing of collections and payments can differ from when revenue and expenses are recognized.' },
    { question: 'What does market equilibrium describe?', answer: 'It is the price and quantity at which quantity supplied equals quantity demanded.' },
    { question: 'Name the four functions of management in this overview.', answer: 'Planning, organizing, leading, and controlling.' },
    { question: 'What are the four elements of the marketing mix?', answer: 'Product, price, place, and promotion.' },
  ],
}

export function getBuiltInMaterials() {
  return [{ ...businessBoardExamReviewer }]
}

export function getBuiltInMaterial(id) {
  return String(id) === businessBoardExamReviewer.id
    ? { ...businessBoardExamReviewer }
    : null
}

export function getBuiltInQuestions(id) {
  const material = getBuiltInMaterial(id)
  if (!material) return []
  return material.questions.map((question, index) => ({
    ...question,
    id: `${material.id}-${index + 1}`,
    materialId: material.id,
  }))
}
