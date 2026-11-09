import BuiltInReviewer from '../BuiltInReviewer.js'
import * as sources from '../sources.js'

class BusinessFundamentalsReviewer extends BuiltInReviewer {
  constructor() {
    super({
      id: 'business-fundamentals-sample',
      title: 'Business Fundamentals: Accounting and Economics',
      course: 'Business Fundamentals',
      isBuiltIn: true,
      content: 'An illustrative study sample covering introductory accounting and microeconomics. It is not a board-exam reviewer.',
      sources: [sources.accountingSource, sources.economicsSource],
      summary: [
        {
          title: 'Accounting turns information into decisions',
          text: 'Accounting organizes, analyzes, and communicates financial information so people can make informed choices. Depending on the decision, relevant nonfinancial factors may matter too.',
          application: 'Ask who will use the information and what decision it should support; include operational factors when financial amounts alone do not explain the choice.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          title: 'Financial and managerial accounting serve different users',
          text: 'Financial accounting reports an organization’s financial performance for external users. Managerial accounting supplies internal decision-makers with financial and nonfinancial information.',
          application: 'Classify the audience and purpose: external reporting points to financial accounting; planning, budgeting, pricing, and cost analysis point to managerial accounting.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          title: 'Demand is a relationship; quantity demanded is one amount',
          text: 'Demand describes the quantities buyers are willing and able to purchase at different prices. Quantity demanded is the amount associated with a particular price, holding other relevant factors constant.',
          application: 'A change in the good’s own price changes quantity demanded along a demand curve; a change in another demand factor can shift the curve.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          title: 'Supply is a relationship; quantity supplied is one amount',
          text: 'Supply describes the quantities producers are willing to offer at different prices. Quantity supplied is the amount associated with a particular price, holding other relevant factors constant.',
          application: 'A change in the good’s own price changes quantity supplied along a supply curve; a change in another supply factor can shift the curve.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          title: 'Equilibrium matches buyers’ and sellers’ plans',
          text: 'In the supply-and-demand model, equilibrium is where quantity demanded equals quantity supplied. A price above equilibrium creates a surplus; a price below it creates a shortage.',
          application: 'Compare quantity supplied with quantity demanded at the stated price. The linked chapter’s numerical examples illustrate the model and are not current market data.',
          sourceIds: [sources.economicsSource.id],
        },
      ],
      findings: [
        {
          text: 'Accounting information supports decisions, but financial data alone may not be sufficient.',
          explanation: 'A decision-maker may consider amounts such as proceeds and expenses alongside nonfinancial factors. OpenStax illustrates this with a theater manager considering marketing, weather, and competing events when assessing a performance.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          text: 'Financial and managerial accounting serve different audiences and purposes.',
          explanation: 'Financial accounting reports are intended for users outside the organization. Managerial accounting information is generally used internally to make decisions, set goals, and evaluate operations; examples include budgeting, pricing, and production costs.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          text: 'Demand is not the same as quantity demanded.',
          explanation: 'Demand is the relationship between a range of prices and the quantities buyers are willing and able to purchase. Quantity demanded is one amount at a particular price, assuming other factors affecting demand are held constant.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          text: 'Supply is not the same as quantity supplied.',
          explanation: 'Supply is the relationship between prices and the quantities producers are willing to offer. Quantity supplied is the amount offered at a particular price, with other relevant factors held constant.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          text: 'The law of demand and the law of supply describe opposite price relationships, all else equal.',
          explanation: 'The OpenStax section describes an inverse relationship between price and quantity demanded, and a positive relationship between price and quantity supplied. These are movements in quantity along the relevant relationship when price changes, not a claim that every real-world market behaves identically regardless of other factors.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          text: 'Equilibrium is the price at which buyers’ and producers’ plans agree.',
          explanation: 'At equilibrium, quantity demanded equals quantity supplied. The textbook’s gasoline example reaches this at $1.40 per gallon and 600 million gallons for the period represented by its schedules; those figures are an example, not a general market estimate.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          text: 'A price above equilibrium creates excess supply in the textbook’s model.',
          explanation: 'At the example price of $1.80, the schedule shows quantity demanded of 500 million gallons and quantity supplied of 680 million gallons. Since supply exceeds demand, the text calls this a surplus.',
          sourceIds: [sources.economicsSource.id],
        },
      ],
      keyTerms: [
        {
          term: 'Accounting',
          definition: 'The process of organizing, analyzing, and communicating financial information used for decision-making.',
          explanation: 'Accounting information can inform both personal and organizational decisions. The cited chapter notes that relevant choices may involve financial and nonfinancial factors.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          term: 'Financial accounting',
          definition: 'Accounting that measures an organization’s financial performance and prepares financial reports for external stakeholders.',
          explanation: 'The cited text names owners, stockholders, lenders, and government entities as examples of external users.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          term: 'Managerial accounting',
          definition: 'Accounting information used within an organization to support decisions and business goals.',
          explanation: 'Examples in the cited chapter include budgeting, pricing, and determining production costs. It may use financial and nonfinancial information.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          term: 'Demand',
          definition: 'The amount of a good or service consumers are willing and able to buy at each price.',
          explanation: 'In the cited economics text, willingness without ability to pay is not effective demand.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Quantity demanded',
          definition: 'The amount consumers would purchase at one specified price.',
          explanation: 'It is one point on a demand curve or one entry in a demand schedule, not the entire price-quantity relationship.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Law of demand',
          definition: 'Holding other factors constant, a higher price is associated with a lower quantity demanded, and a lower price with a higher quantity demanded.',
          explanation: 'This is an inverse relationship, described in the cited source as applying when other variables that affect demand are held constant.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Supply',
          definition: 'The amount of a good or service producers are willing to produce or bring to market at each price.',
          explanation: 'The concept describes a relationship across prices rather than a single quantity.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Quantity supplied',
          definition: 'The amount producers are willing to offer at one specified price.',
          explanation: 'It is one point on a supply curve or one entry in a supply schedule.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Law of supply',
          definition: 'Holding other factors constant, a higher price is associated with a higher quantity supplied, and a lower price with a lower quantity supplied.',
          explanation: 'The cited source describes this as a positive relationship between price and quantity supplied, assuming other variables affecting supply are held constant.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Equilibrium price',
          definition: 'The price at which quantity demanded equals quantity supplied.',
          explanation: 'At this price, the plans of consumers and producers agree in the cited supply-and-demand model.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Equilibrium quantity',
          definition: 'The common quantity demanded and supplied at the equilibrium price.',
          explanation: 'It is the quantity bought and sold where the demand and supply schedules or curves intersect in the model.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          term: 'Surplus (excess supply)',
          definition: 'A condition where quantity supplied exceeds quantity demanded at a given price.',
          explanation: 'The cited textbook illustrates a surplus at an above-equilibrium price in its gasoline example.',
          sourceIds: [sources.economicsSource.id],
        },
      ],
      questions: [
        {
          question: 'How does the cited text distinguish financial accounting from managerial accounting?',
          answer: 'Financial accounting measures performance and prepares reports for external stakeholders. Managerial accounting uses financial and nonfinancial information internally to support decisions, budgeting, pricing, and production-cost analysis.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          question: 'Why might financial information alone be insufficient for a business decision?',
          answer: 'Nonfinancial factors can affect the decision and its outcome. For example, the cited chapter says a theater manager may consider marketing, weather, and competing events alongside proceeds and expenses.',
          sourceIds: [sources.accountingSource.id],
        },
        {
          question: 'Distinguish demand from quantity demanded.',
          answer: 'Demand is the relationship between prices and the amounts consumers are willing and able to buy. Quantity demanded is the amount associated with one particular price.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'State the law of demand and its assumption.',
          answer: 'Holding other factors constant, a higher price is associated with lower quantity demanded, and a lower price with higher quantity demanded.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'Distinguish supply from quantity supplied.',
          answer: 'Supply is the relationship between prices and the amounts producers are willing to offer. Quantity supplied is the amount offered at one particular price.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'State the law of supply and its assumption.',
          answer: 'Holding other factors constant, a higher price is associated with a higher quantity supplied, and a lower price with a lower quantity supplied.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'What condition defines equilibrium in the supply-and-demand model?',
          answer: 'Quantity demanded equals quantity supplied at the equilibrium price.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'In the OpenStax gasoline schedule, what are the equilibrium price and quantity?',
          answer: '$1.40 per gallon and 600 million gallons for the period represented in that example. These figures illustrate how to identify equilibrium in a schedule and should not be treated as current or general market data.',
          sourceIds: [sources.economicsSource.id],
        },
        {
          question: 'In the cited gasoline example, what happens at $1.80 per gallon?',
          answer: 'Quantity demanded is 500 million gallons and quantity supplied is 680 million gallons, so quantity supplied exceeds quantity demanded and the example has a surplus.',
          sourceIds: [sources.economicsSource.id],
        },
      ],
    })
  }
}

export default new BusinessFundamentalsReviewer()
