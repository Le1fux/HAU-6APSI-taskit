import BuiltInReviewer from '../BuiltInReviewer.js'
import cpaleReviewer from './cpale.js'
import * as sources from '../sources.js'

const subjects = [
  {
    id: 'far',
    abbreviation: 'FAR',
    summaryIndex: 0,
    findingIndices: [0],
    termIndices: [0],
    questionIndices: [0, 1, 30, 31, 32],
    coverage: [
      { title: 'Framework and presentation', text: 'Conceptual framework; general-purpose reporting; statement presentation; classification and disclosure.' },
      { title: 'Cash and receivables', text: 'Recognition, measurement, impairment, derecognition, and presentation of cash, receivables, and related instruments.' },
      { title: 'Inventories and operations', text: 'Inventory cost, cost formulas, net realizable value, and recognition of related expenses.' },
      { title: 'Long-lived assets', text: 'Property, plant and equipment; depreciation; intangible assets; investment property; impairment; and disposals.' },
      { title: 'Liabilities and equity', text: 'Provisions and contingencies, borrowings, financial liabilities, and equity transactions.' },
      { title: 'Revenue and contracts', text: 'Contract identification, performance obligations, transaction price, allocation, and timing of revenue recognition.' },
      { title: 'Other measurement topics', text: 'Leases, employee benefits, income taxes, fair value, and foreign-currency transactions under the applicable standards.' },
      { title: 'Complete reporting cycle', text: 'Cash flows, accounting policies and estimates, prior-period errors, events after reporting period, and disclosures.' },
    ],
  },
  {
    id: 'afar',
    abbreviation: 'AFAR',
    summaryIndex: 1,
    findingIndices: [1],
    termIndices: [1, 2],
    questionIndices: [2, 3, 4, 33, 34, 35],
    coverage: [
      { title: 'Business combinations', text: 'Identify the acquirer and acquisition date; measure consideration and identifiable net assets; analyze goodwill or a bargain purchase.' },
      { title: 'Consolidated statements', text: 'Prepare group statements, analyze control and ownership, and present non-controlling interests.' },
      { title: 'Consolidation adjustments', text: 'Eliminate intragroup balances, transactions, dividends, and unrealized profits; reconcile acquisition-date and post-acquisition amounts.' },
      { title: 'Investments', text: 'Classify interests in associates and joint arrangements and apply the relevant accounting method.' },
      { title: 'Partnership accounting', text: 'Account for formation, operations, admission or retirement of partners, changes in profit sharing, and dissolution.' },
      { title: 'Partnership liquidation', text: 'Realize assets, settle liabilities, allocate gains and losses, and determine distributions to partners.' },
      { title: 'Branch accounting', text: 'Reconcile home-office and branch records, reciprocal accounts, shipments, and branch results.' },
      { title: 'Other advanced reporting', text: 'Foreign-currency matters and other advanced reporting problems required by the examination program in force.' },
    ],
  },
  {
    id: 'management-services',
    abbreviation: 'MS',
    summaryIndex: 2,
    findingIndices: [2],
    termIndices: [3, 4, 5],
    questionIndices: [5, 6, 7, 8, 9, 36, 37, 38],
    coverage: [
      { title: 'Cost concepts', text: 'Cost behavior, cost objects, cost classification, and cost-volume relationships.' },
      { title: 'Cost systems', text: 'Job-order, process, and other cost accumulation and assignment methods; overhead analysis.' },
      { title: 'Planning models', text: 'Cost-volume-profit analysis, contribution margin, break-even points, and relevant-range assumptions.' },
      { title: 'Budgets', text: 'Operating and financial budgets, flexible budgets, and the use of standards in planning and control.' },
      { title: 'Variance and performance', text: 'Analyze cost and revenue variances and use appropriate responsibility and performance measures.' },
      { title: 'Short-term decisions', text: 'Relevant-cost analysis for special orders, make-or-buy, pricing, product mix, and constrained resources.' },
      { title: 'Long-term decisions', text: 'Capital investment decisions, discounted cash-flow methods, and time value of money.' },
      { title: 'Quantitative methods', text: 'Use the quantitative techniques and decision models required by the current examination program; state assumptions.' },
    ],
  },
  {
    id: 'auditing',
    abbreviation: 'AUD',
    summaryIndex: 3,
    findingIndices: [3],
    termIndices: [6, 7, 8],
    questionIndices: [10, 11, 12, 13, 14, 39, 40, 41],
    coverage: [
      { title: 'Professional foundations', text: 'Audit objectives, ethics, independence, engagement acceptance, and responsibilities of management and the auditor.' },
      { title: 'Planning', text: 'Engagement strategy, materiality, understanding the entity and environment, and audit documentation.' },
      { title: 'Risk and internal control', text: 'Identify and assess risks of material misstatement, including fraud risk; understand and evaluate relevant controls.' },
      { title: 'Assertions and procedures', text: 'Connect financial-statement assertions and assessed risks to appropriate tests of controls and substantive procedures.' },
      { title: 'Evidence and sampling', text: 'Evaluate sufficiency and appropriateness of evidence, external confirmations, sampling, and work performed by others.' },
      { title: 'Account-cycle applications', text: 'Apply audit procedures to material balances, transactions, estimates, and disclosures.' },
      { title: 'Completion', text: 'Evaluate misstatements, subsequent events, going concern, written representations, and other completion evidence.' },
      { title: 'Reports and other engagements', text: 'Form an opinion and understand modifications, emphasis or other-matter paragraphs, and assurance engagements required by current standards.' },
    ],
  },
  {
    id: 'taxation',
    abbreviation: 'TAX',
    summaryIndex: 4,
    findingIndices: [4, 5, 6, 7],
    termIndices: [9, 10, 11],
    questionIndices: [15, 16, 17, 18, 19, 20, 42, 43, 44],
    coverage: [
      { title: 'Tax framework', text: 'Taxpayer classification, tax types, taxable periods, source and situs concepts, and statutory interpretation.' },
      { title: 'Income taxation', text: 'Classify income and taxpayers; determine the tax base and apply deductions, exclusions, credits, and rates effective for the stated period.' },
      { title: 'Business taxes', text: 'Value-added tax and other percentage and business taxes; identify the transaction, tax base, exemptions, and creditability.' },
      { title: 'Other national taxes', text: 'Estate and donor’s taxes, excise taxes, documentary stamp tax, and other topics in the applicable program.' },
      { title: 'Withholding and compliance', text: 'Withholding responsibilities, registration, books, invoicing, returns, filing, and payment obligations.' },
      { title: 'Administration and remedies', text: 'Assessment, collection, protests, claims for refund, prescription, and taxpayer remedies under applicable rules.' },
      { title: 'Recent amendments', text: 'Study how TRAIN, CREATE, Ease of Paying Taxes, VAT on Digital Services, and CREATE MORE amend the NIRC.' },
      { title: 'Current-law verification', text: 'Confirm effectivity dates, rates, thresholds, exemptions, and BIR implementing issuances; do not rely on outdated reviewer tables.' },
    ],
  },
  {
    id: 'rfbt',
    abbreviation: 'RFBT',
    summaryIndex: 5,
    findingIndices: [8, 9, 10, 11],
    termIndices: [12, 13, 14, 15, 16],
    questionIndices: [21, 22, 23, 24, 25, 26, 27, 28, 29, 45, 46, 47],
    coverage: [
      { title: 'Civil-law foundations', text: 'Sources and application of obligations; performance, breach, damages, and extinguishment.' },
      { title: 'Contracts', text: 'Essential requisites, consent and its defects, object and cause, form, interpretation, rescission, and remedies.' },
      { title: 'Commercial relationships', text: 'Sales and other commercial relationships and special laws to the extent included in the applicable program.' },
      { title: 'Partnerships', text: 'Formation, partner rights and duties, management, liability, dissolution, and winding up.' },
      { title: 'Corporations', text: 'Corporate personality, powers, governance, capital, shares, directors, stockholders, and dissolution.' },
      { title: 'Securities and financial distress', text: 'Securities regulation, rehabilitation, insolvency, liquidation, and creditor rights.' },
      { title: 'Secured transactions', text: 'Creation, perfection, priority, registration, and enforcement of security interests in personal property.' },
      { title: 'Professional and special laws', text: 'Accountancy regulation, privacy, and other special laws only as required by the examination program in force.' },
    ],
  },
]

function createSubjectReviewer(subject) {
  const summary = cpaleReviewer.summary[subject.summaryIndex]
  const usedSourceIds = new Set([
    ...summary.sourceIds,
    ...subject.findingIndices.flatMap((index) => cpaleReviewer.findings[index].sourceIds),
    ...subject.termIndices.flatMap((index) => cpaleReviewer.keyTerms[index].sourceIds),
    ...subject.questionIndices.flatMap((index) => cpaleReviewer.questions[index].sourceIds || []),
  ])
  const reviewerSources = cpaleReviewer.sources.filter((source) => usedSourceIds.has(source.id))

  return new BuiltInReviewer({
    id: `cpale-${subject.id}`,
    title: `CPALE ${subject.abbreviation}: ${summary.title.replace(/ \([^)]+\)$/, '')}`,
    course: `Accountancy - CPALE - ${subject.abbreviation}`,
    isBuiltIn: true,
    content: `${summary.text} ${summary.application} This is an independent, subject-specific study aid—not an official or exhaustive PRC/BOA syllabus or question bank. Its coverage map follows the six CPALE subject areas, not a verified current Table of Specifications. Confirm the official program and effective standards, laws, and tax rules for your examination.`,
    sources: reviewerSources,
    summary: [
      summary,
      ...subject.coverage.map((item) => ({
        title: item.title,
        text: item.text,
      })),
    ],
    findings: subject.findingIndices.map((index) => cpaleReviewer.findings[index]),
    keyTerms: subject.termIndices.map((index) => cpaleReviewer.keyTerms[index]),
    questions: subject.questionIndices.map((index) => cpaleReviewer.questions[index]),
  })
}

export default subjects.map(createSubjectReviewer)
