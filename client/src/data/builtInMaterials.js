const accountingSource = {
  id: 'openstax-accounting',
  title: 'OpenStax: Principles of Financial Accounting, Section 1.1',
  url: 'https://openstax.org/books/principles-financial-accounting/pages/1-1-explain-the-importance-of-accounting-and-distinguish-between-financial-and-managerial-accounting',
}

const economicsSource = {
  id: 'openstax-economics',
  title: 'OpenStax: Principles of Economics 3e, Section 3.1',
  url: 'https://openstax.org/books/principles-economics-3e/pages/3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services',
}

const cpaleSource = {
  id: 'prc-cpale',
  title: 'PRC: official licensure announcements and updates',
  url: 'https://www.prc.gov.ph/',
}

const businessFundamentalsReviewer = {
  id: 'business-fundamentals-sample',
  title: 'Business Fundamentals: Accounting and Economics',
  course: 'Business Fundamentals',
  isBuiltIn: true,
  content: 'An illustrative study sample covering introductory accounting and microeconomics. It is not a board-exam reviewer.',
  sources: [accountingSource, economicsSource],
  summary: [
    {
      text: 'Accounting organizes, analyzes, and communicates financial information to support decisions. Business choices can also require nonfinancial considerations, such as reliability, customer needs, or operating conditions.',
      sourceIds: [accountingSource.id],
    },
    {
      text: 'Financial accounting prepares reports about organizational financial performance for external stakeholders. Managerial accounting provides financial and nonfinancial information for internal decisions such as budgeting, pricing, and production-cost analysis.',
      sourceIds: [accountingSource.id],
    },
    {
      text: 'In economics, demand describes how much buyers are willing and able to purchase at different prices; quantity demanded means the amount buyers would purchase at one specific price.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'Supply describes how much producers are willing to bring to market at different prices; quantity supplied means the amount offered at one specific price.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'Market equilibrium occurs at the price where quantity demanded equals quantity supplied. At a price above equilibrium, the cited text illustrates excess supply (a surplus).',
      sourceIds: [economicsSource.id],
    },
  ],
  findings: [
    {
      text: 'Accounting information supports decisions, but financial data alone may not be sufficient.',
      explanation: 'A decision-maker may consider amounts such as proceeds and expenses alongside nonfinancial factors. OpenStax illustrates this with a theater manager considering marketing, weather, and competing events when assessing a performance.',
      sourceIds: [accountingSource.id],
    },
    {
      text: 'Financial and managerial accounting serve different audiences and purposes.',
      explanation: 'Financial accounting reports are intended for users outside the organization. Managerial accounting information is generally used internally to make decisions, set goals, and evaluate operations; examples include budgeting, pricing, and production costs.',
      sourceIds: [accountingSource.id],
    },
    {
      text: 'Demand is not the same as quantity demanded.',
      explanation: 'Demand is the relationship between a range of prices and the quantities buyers are willing and able to purchase. Quantity demanded is one amount at a particular price, assuming other factors affecting demand are held constant.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'Supply is not the same as quantity supplied.',
      explanation: 'Supply is the relationship between prices and the quantities producers are willing to offer. Quantity supplied is the amount offered at a particular price, with other relevant factors held constant.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'The law of demand and the law of supply describe opposite price relationships, all else equal.',
      explanation: 'The OpenStax section describes an inverse relationship between price and quantity demanded, and a positive relationship between price and quantity supplied. These are movements in quantity along the relevant relationship when price changes, not a claim that every real-world market behaves identically regardless of other factors.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'Equilibrium is the price at which buyers’ and producers’ plans agree.',
      explanation: 'At equilibrium, quantity demanded equals quantity supplied. The textbook’s gasoline example reaches this at $1.40 per gallon and 600 million gallons for the period represented by its schedules; those figures are an example, not a general market estimate.',
      sourceIds: [economicsSource.id],
    },
    {
      text: 'A price above equilibrium creates excess supply in the textbook’s model.',
      explanation: 'At the example price of $1.80, the schedule shows quantity demanded of 500 million gallons and quantity supplied of 680 million gallons. Since supply exceeds demand, the text calls this a surplus.',
      sourceIds: [economicsSource.id],
    },
  ],
  keyTerms: [
    {
      term: 'Accounting',
      definition: 'The process of organizing, analyzing, and communicating financial information used for decision-making.',
      explanation: 'Accounting information can inform both personal and organizational decisions. The cited chapter notes that relevant choices may involve financial and nonfinancial factors.',
      sourceIds: [accountingSource.id],
    },
    {
      term: 'Financial accounting',
      definition: 'Accounting that measures an organization’s financial performance and prepares financial reports for external stakeholders.',
      explanation: 'The cited text names owners, stockholders, lenders, and government entities as examples of external users.',
      sourceIds: [accountingSource.id],
    },
    {
      term: 'Managerial accounting',
      definition: 'Accounting information used within an organization to support decisions and business goals.',
      explanation: 'Examples in the cited chapter include budgeting, pricing, and determining production costs. It may use financial and nonfinancial information.',
      sourceIds: [accountingSource.id],
    },
    {
      term: 'Demand',
      definition: 'The amount of a good or service consumers are willing and able to buy at each price.',
      explanation: 'In the cited economics text, willingness without ability to pay is not effective demand.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Quantity demanded',
      definition: 'The amount consumers would purchase at one specified price.',
      explanation: 'It is one point on a demand curve or one entry in a demand schedule, not the entire price-quantity relationship.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Law of demand',
      definition: 'Holding other factors constant, a higher price is associated with a lower quantity demanded, and a lower price with a higher quantity demanded.',
      explanation: 'This is an inverse relationship, described in the cited source as applying when other variables that affect demand are held constant.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Supply',
      definition: 'The amount of a good or service producers are willing to produce or bring to market at each price.',
      explanation: 'The concept describes a relationship across prices rather than a single quantity.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Quantity supplied',
      definition: 'The amount producers are willing to offer at one specified price.',
      explanation: 'It is one point on a supply curve or one entry in a supply schedule.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Law of supply',
      definition: 'Holding other factors constant, a higher price is associated with a higher quantity supplied, and a lower price with a lower quantity supplied.',
      explanation: 'The cited source describes this as a positive relationship between price and quantity supplied, assuming other variables affecting supply are held constant.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Equilibrium price',
      definition: 'The price at which quantity demanded equals quantity supplied.',
      explanation: 'At this price, the plans of consumers and producers agree in the cited supply-and-demand model.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Equilibrium quantity',
      definition: 'The common quantity demanded and supplied at the equilibrium price.',
      explanation: 'It is the quantity bought and sold where the demand and supply schedules or curves intersect in the model.',
      sourceIds: [economicsSource.id],
    },
    {
      term: 'Surplus (excess supply)',
      definition: 'A condition where quantity supplied exceeds quantity demanded at a given price.',
      explanation: 'The cited textbook illustrates a surplus at an above-equilibrium price in its gasoline example.',
      sourceIds: [economicsSource.id],
    },
  ],
  questions: [
    {
      question: 'How does the cited text distinguish financial accounting from managerial accounting?',
      answer: 'Financial accounting measures performance and prepares reports for external stakeholders. Managerial accounting uses financial and nonfinancial information internally to support decisions, budgeting, pricing, and production-cost analysis.',
      sourceIds: [accountingSource.id],
    },
    {
      question: 'Why might financial information alone be insufficient for a business decision?',
      answer: 'Nonfinancial factors can affect the decision and its outcome. For example, the cited chapter says a theater manager may consider marketing, weather, and competing events alongside proceeds and expenses.',
      sourceIds: [accountingSource.id],
    },
    {
      question: 'Distinguish demand from quantity demanded.',
      answer: 'Demand is the relationship between prices and the amounts consumers are willing and able to buy. Quantity demanded is the amount associated with one particular price.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'State the law of demand and its assumption.',
      answer: 'Holding other factors constant, a higher price is associated with lower quantity demanded, and a lower price with higher quantity demanded.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'Distinguish supply from quantity supplied.',
      answer: 'Supply is the relationship between prices and the amounts producers are willing to offer. Quantity supplied is the amount offered at one particular price.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'State the law of supply and its assumption.',
      answer: 'Holding other factors constant, a higher price is associated with a higher quantity supplied, and a lower price with a lower quantity supplied.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'What condition defines equilibrium in the supply-and-demand model?',
      answer: 'Quantity demanded equals quantity supplied at the equilibrium price.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'In the OpenStax gasoline schedule, what are the equilibrium price and quantity?',
      answer: '$1.40 per gallon and 600 million gallons for the period represented in that example. These figures illustrate how to identify equilibrium in a schedule and should not be treated as current or general market data.',
      sourceIds: [economicsSource.id],
    },
    {
      question: 'In the cited gasoline example, what happens at $1.80 per gallon?',
      answer: 'Quantity demanded is 500 million gallons and quantity supplied is 680 million gallons, so quantity supplied exceeds quantity demanded and the example has a surplus.',
      sourceIds: [economicsSource.id],
    },
  ],
}

const cpaleReviewer = {
  id: 'philippine-cpale-reviewer',
  title: 'Philippine CPA Licensure Examination Reviewer',
  course: 'Accountancy - CPALE',
  isBuiltIn: true,
  content: 'A starter reviewer organized around the six CPALE subjects. Use it to plan revision, not as an official or exhaustive syllabus. Confirm the current examination syllabus and effective dates of laws and standards with the PRC and Board of Accountancy.',
  sources: [cpaleSource],
  summary: [
    {
      text: 'Financial Accounting and Reporting (FAR) applies financial-reporting concepts and standards to transactions and balances. Review the accounting cycle, financial-statement presentation, cash and receivables, inventories, property and equipment, intangibles, liabilities, equity, revenue, leases, financial instruments, and cash flows.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Advanced Financial Accounting and Reporting (AFAR) extends reporting principles to complex arrangements. Common review areas include business combinations, consolidated statements and eliminations, investments, partnerships, branch accounting, foreign-currency transactions, joint arrangements, and not-for-profit accounting.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Management Services (MS) uses cost information and quantitative analysis for planning, control, and decisions. Review cost behavior, job and process costing, activity-based costing, cost-volume-profit analysis, budgets, standard costs and variances, relevant costing, performance measurement, and working-capital and capital-investment decisions.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Auditing develops assurance and evidence skills. Review ethics and independence, engagement acceptance, materiality, risk assessment, internal control, audit sampling, substantive and control procedures, audit evidence, completion procedures, audit reports, and related assurance engagements.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Taxation applies Philippine tax rules to taxpayers and transactions. Organize review around income taxation, business and transfer taxes, withholding, tax administration and remedies, registration, returns, and compliance. Rates, thresholds, exemptions, and deadlines change; verify the rules effective for your examination.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Regulatory Framework for Business Transactions (RFBT) applies Philippine law to business fact patterns. Review obligations and contracts, sales and credit transactions, partnerships, corporations, securities, negotiable instruments, insolvency, and other commercial laws included in the current syllabus.',
      sourceIds: [cpaleSource.id],
    },
  ],
  findings: [
    {
      text: 'FAR focuses on financial reporting for individual entities.',
      explanation: 'Be prepared to analyze transactions, apply recognition and measurement principles, and determine their presentation and disclosure in financial statements under the applicable reporting framework.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'AFAR applies reporting concepts to complex accounting arrangements.',
      explanation: 'Practice combining and reconciling information across entities and arrangements, including business combinations, consolidated statements, partnerships, branches, and foreign-currency matters.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'MS connects accounting information with management decisions.',
      explanation: 'Core practice areas include cost behavior, cost-volume-profit analysis, budgeting, standard costs and variances, performance measurement, quantitative methods, and financial-management decisions.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Auditing requires evidence-based conclusions and clear reporting.',
      explanation: 'Understand how engagement acceptance, ethics, materiality, risk assessment, internal-control understanding, audit procedures, sufficient appropriate evidence, and the final opinion fit together.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Taxation tests both tax computation and compliance.',
      explanation: 'Review the structure of Philippine taxes, taxpayer and transaction classification, tax-base and tax-due computations, filing and payment obligations, and available remedies. Use current law and official issuances for rates, thresholds, and deadlines.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'RFBT applies business law to fact patterns.',
      explanation: 'Identify the governing rule, the parties’ rights and duties, and the legal effect of the facts. Review civil-law obligations and contracts alongside partnership, corporation, securities, credit, and other commercial-law topics in the current syllabus.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'FAR questions reward consistent application of standards to facts.',
      explanation: 'Identify the transaction, applicable recognition and measurement rule, required presentation, and any disclosure implication. Reconcile the result to the affected financial-statement accounts.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'AFAR problems often combine multiple computations and adjustments.',
      explanation: 'Keep ownership interests, reporting dates, and inter-entity relationships clear. Reconcile schedules and elimination entries to the final consolidated or arrangement-specific amounts.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'MS decision analysis focuses on information that changes the choice.',
      explanation: 'For short-term alternatives, compare future revenues and costs that differ. For long-term investments, incorporate timing, risk, and the time value of money as required by the problem.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Audit procedures should respond to assessed risks.',
      explanation: 'Understand the distinction between tests of controls and substantive procedures, and how materiality, sampling, reliability of evidence, misstatements, and subsequent events affect the engagement.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'Tax computations depend on the taxpayer, period, and transaction facts.',
      explanation: 'Establish taxpayer classification and taxable period first, then identify the current applicable rule, tax base, rate, credits, exceptions, and compliance steps.',
      sourceIds: [cpaleSource.id],
    },
    {
      text: 'RFBT answers should connect legal rules to the specific facts.',
      explanation: 'Identify the issue and governing law, apply each required element and relevant exception, then state the resulting rights, duties, or legal consequence.',
      sourceIds: [cpaleSource.id],
    },
  ],
  keyTerms: [
    {
      term: 'Financial reporting',
      definition: 'The process of recognizing, measuring, presenting, and disclosing financial information for users.',
      explanation: 'FAR applies the reporting framework to transactions and balances of an entity.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Consolidated financial statements',
      definition: 'Financial statements that present a parent and its subsidiaries as a single economic entity.',
      explanation: 'AFAR problems commonly require analyzing control, consolidation adjustments, and intragroup balances and transactions.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Cost-volume-profit analysis',
      definition: 'Analysis of how selling price, sales volume, variable costs, fixed costs, and product mix affect profit.',
      explanation: 'MS uses this relationship to support planning and short-term decisions.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Audit risk',
      definition: 'The risk that an auditor expresses an inappropriate opinion when the financial statements are materially misstated.',
      explanation: 'Auditors assess risks and design procedures to obtain sufficient appropriate evidence.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Tax compliance',
      definition: 'Meeting applicable tax registration, reporting, filing, payment, and documentation obligations.',
      explanation: 'Specific obligations depend on current Philippine law and the taxpayer’s facts.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Obligation',
      definition: 'A legal duty to give, to do, or not to do, as defined by applicable law.',
      explanation: 'RFBT questions often ask how obligations arise, are performed, or are extinguished under the governing rules.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Accrual basis',
      definition: 'Recognition of the effects of transactions when they occur, rather than only when cash is received or paid.',
      explanation: 'Apply the applicable recognition criteria and period-end adjustments.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Elimination entry',
      definition: 'A consolidation adjustment that removes specified effects of transactions or balances between entities in a group.',
      explanation: 'Eliminations help prevent intragroup activity from being presented as activity with outside parties.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Relevant cost',
      definition: 'A future cost that differs between decision alternatives.',
      explanation: 'A cost that is identical under all alternatives does not affect an incremental comparison.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Sufficient appropriate audit evidence',
      definition: 'Evidence whose quantity and quality together support the auditor’s conclusions.',
      explanation: 'Sufficiency relates to quantity; appropriateness relates to relevance and reliability.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Tax base',
      definition: 'The amount or measure to which a tax rate or rule is applied.',
      explanation: 'Determine the proper base and applicable current rule before calculating tax due.',
      sourceIds: [cpaleSource.id],
    },
    {
      term: 'Separate juridical personality',
      definition: 'The principle that a corporation has a legal personality distinct from its shareholders, subject to applicable law.',
      explanation: 'Apply the governing corporate statute and the facts, including any applicable grounds for exceptions or personal liability.',
      sourceIds: [cpaleSource.id],
    },
  ],
  questions: [
    {
      question: 'Which CPALE subject primarily covers recognition, measurement, presentation, and disclosure in an entity’s financial statements?',
      answer: 'Financial Accounting and Reporting (FAR).',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Name two complex reporting areas commonly associated with AFAR.',
      answer: 'Examples include business combinations and consolidated financial statements; partnerships, branches, and foreign-currency transactions are also included in this reviewer’s outline.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What does cost-volume-profit analysis help management evaluate?',
      answer: 'How selling price, sales volume, variable and fixed costs, and product mix affect profit and decisions.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What is the purpose of audit risk assessment?',
      answer: 'To identify and evaluate risks of material misstatement and help design appropriate audit procedures and evidence-gathering responses.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Why should examinees verify tax rates and thresholds against current Philippine issuances?',
      answer: 'Tax laws and regulations can change, so a rate or threshold in an older reviewer may not apply to the exam date or the facts in a question.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What is one central skill tested in RFBT fact-pattern questions?',
      answer: 'Identify the applicable legal rule, then apply it to determine the parties’ rights, duties, and the legal effect of the facts.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Under accrual accounting, when are transaction effects generally recognized?',
      answer: 'When the relevant recognition criteria are met and the transaction occurs, rather than merely when cash is received or paid.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Why are intragroup balances and transactions eliminated in consolidated statements?',
      answer: 'The group is presented as one economic entity; transactions within the group are not transactions with outside parties and should not be double-counted in consolidated results or balances.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What is the break-even condition in a single-product cost-volume-profit model?',
      answer: 'Total contribution margin equals total fixed costs, so operating income is zero. Consider the model assumptions and relevant range.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'How is a budget variance generally analyzed?',
      answer: 'Compare actual results with an appropriate budget, separate relevant price or rate effects from quantity or efficiency effects where applicable, and investigate causes rather than treating the variance alone as a performance conclusion.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'How does a test of controls differ from a substantive procedure?',
      answer: 'A test of controls evaluates whether a control operated effectively. A substantive procedure is designed to detect material misstatements in an assertion or balance.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What is the difference between sufficient and appropriate audit evidence?',
      answer: 'Sufficiency concerns the quantity of evidence; appropriateness concerns its relevance and reliability.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What sequence is useful when solving a Philippine tax computation problem?',
      answer: 'Determine the taxpayer and taxable period, classify the income or transaction, identify the current applicable rule and tax base, compute the tax, and check relevant credits, compliance requirements, and exceptions.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Why should a reviewer avoid hard-coding tax rates without a date or source?',
      answer: 'Rates and other tax rules can change. A computation must use the law and official issuances applicable to the stated facts and examination coverage date.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'What is the general effect of a corporation’s separate juridical personality?',
      answer: 'The corporation generally has a legal personality distinct from its shareholders. Apply the relevant statute and facts, including any grounds for exceptions or personal liability.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Which CPALE subject uses costing, budgeting, and quantitative analysis to support management decisions?',
      answer: 'Management Services (MS).',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Which CPALE subject focuses on assurance engagements, audit evidence, and the auditor’s report?',
      answer: 'Auditing.',
      sourceIds: [cpaleSource.id],
    },
    {
      question: 'Which CPALE subject applies civil and commercial law to business transactions?',
      answer: 'Regulatory Framework for Business Transactions (RFBT).',
      sourceIds: [cpaleSource.id],
    },
  ],
}

function createFocusedReviewer({ id, title, course, source, description }) {
  const usesSource = (item) => item.sourceIds?.includes(source.id)

  return {
    ...businessFundamentalsReviewer,
    id,
    title,
    course,
    content: description,
    sources: [source],
    summary: businessFundamentalsReviewer.summary.filter(usesSource),
    findings: businessFundamentalsReviewer.findings.filter(usesSource),
    keyTerms: businessFundamentalsReviewer.keyTerms.filter(usesSource),
    questions: businessFundamentalsReviewer.questions.filter(usesSource),
  }
}

const accountingReviewer = createFocusedReviewer({
  id: 'intro-financial-accounting',
  title: 'Introduction to Financial Accounting',
  course: 'Accounting',
  source: accountingSource,
  description: 'A focused sample on the purpose of accounting and the differences between financial and managerial accounting. Use the linked OpenStax chapter and your course materials for further study.',
})

const economicsReviewer = createFocusedReviewer({
  id: 'demand-supply-equilibrium',
  title: 'Demand, Supply, and Market Equilibrium',
  course: 'Economics',
  source: economicsSource,
  description: 'A focused sample on demand, supply, equilibrium, and surpluses in the cited OpenStax model. Examples in the source are illustrative, not current market data.',
})

const builtInMaterials = [
  cpaleReviewer,
  businessFundamentalsReviewer,
  accountingReviewer,
  economicsReviewer,
]

export function getBuiltInMaterials() {
  return builtInMaterials.map((material) => ({ ...material }))
}

export function getBuiltInMaterial(id) {
  const material = builtInMaterials.find((item) => item.id === String(id))
  return material ? { ...material } : null
}

export function getBuiltInQuestions(id) {
  const material = getBuiltInMaterial(id)
  if (!material) return []
  return material.questions.map((question, index) => ({
    ...question,
    id: `${material.id}-${index + 1}`,
    materialId: material.id,
    sources: material.sources,
  }))
}
