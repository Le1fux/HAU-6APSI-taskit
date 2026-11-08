import FocusedBuiltInReviewer from '../FocusedBuiltInReviewer.js'
import businessFundamentalsReviewer from './businessFundamentals.js'
import { accountingSource } from '../sources.js'

class AccountingReviewer extends FocusedBuiltInReviewer {
  constructor() {
    super({
      id: 'intro-financial-accounting',
      title: 'Introduction to Financial Accounting',
      course: 'Accounting',
      source: accountingSource,
      baseReviewer: businessFundamentalsReviewer,
      description: 'A focused sample on the purpose of accounting and the differences between financial and managerial accounting. Use the linked OpenStax chapter and your course materials for further study.',
    })
  }
}

export default new AccountingReviewer()
