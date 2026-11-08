import FocusedBuiltInReviewer from '../FocusedBuiltInReviewer.js'
import businessFundamentalsReviewer from './businessFundamentals.js'
import { economicsSource } from '../sources.js'

class EconomicsReviewer extends FocusedBuiltInReviewer {
  constructor() {
    super({
      id: 'demand-supply-equilibrium',
      title: 'Demand, Supply, and Market Equilibrium',
      course: 'Economics',
      source: economicsSource,
      baseReviewer: businessFundamentalsReviewer,
      description: 'A focused sample on demand, supply, equilibrium, and surpluses in the cited OpenStax model. Examples in the source are illustrative, not current market data.',
    })
  }
}

export default new EconomicsReviewer()
