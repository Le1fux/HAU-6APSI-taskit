import BuiltInReviewer from '../BuiltInReviewer.js'
import * as sources from '../sources.js'

class CpaleReviewer extends BuiltInReviewer {
  constructor() {
    super({
      id: 'philippine-cpale-reviewer',
      title: 'Philippine CPA Licensure Examination Reviewer',
      course: 'Accountancy - CPALE',
      isBuiltIn: true,
      content: 'A source-linked study guide organized around the six CPALE subjects, with additional emphasis on Philippine taxation and business law. It is an independent study aid, not an official or exhaustive PRC/BOA syllabus. Laws, revenue issuances, and adopted standards may change; verify the rules and examination coverage effective for your exam.',
      sources: [
        sources.cpaleProgramSource,
        sources.financialReportingSource,
        sources.managementAccountingSource,
        sources.auditingStandardsSource,
        sources.accountancyActSource,
        sources.nircSource,
        sources.trainSource,
        sources.createSource,
        sources.easeOfPayingTaxesSource,
        sources.digitalServicesVatSource,
        sources.createMoreSource,
        sources.civilCodeSource,
        sources.revisedCorporationCodeSource,
        sources.securitiesRegulationCodeSource,
        sources.friaSource,
        sources.personalPropertySecuritySource,
        sources.dataPrivacySource,
      ],
      summary: [
        {
          text: 'Financial Accounting and Reporting (FAR) applies the applicable Philippine Financial Reporting Standards to recognition, measurement, presentation, and disclosure. Core practice includes financial statements, revenue, inventories, leases, financial instruments, assets, liabilities, equity, and cash flows.',
          sourceIds: [sources.cpaleProgramSource.id, sources.financialReportingSource.id],
        },
        {
          text: 'Advanced Financial Accounting and Reporting (AFAR) applies reporting standards to complex structures and transactions. Practice control and consolidation, business combinations, intercompany eliminations, foreign-currency matters, investments, partnerships, branches, and other arrangements covered by the current syllabus.',
          sourceIds: [sources.cpaleProgramSource.id, sources.financialReportingSource.id],
        },
        {
          text: 'Management Services (MS) uses cost information and quantitative methods for planning, control, and decisions. Review cost behavior and systems, cost-volume-profit analysis, budgets and variances, relevant costs, performance measures, and capital-investment decisions.',
          sourceIds: [sources.cpaleProgramSource.id, sources.managementAccountingSource.id],
        },
        {
          text: 'Auditing applies professional standards to engagement quality, ethics, risk assessment, internal controls, evidence, sampling, completion, reporting, and other assurance work. A financial-statement audit provides reasonable, not absolute, assurance.',
          sourceIds: [sources.cpaleProgramSource.id, sources.auditingStandardsSource.id, sources.accountancyActSource.id],
        },
        {
          text: 'Taxation applies the National Internal Revenue Code and amendments to specific taxpayers, periods, and transactions. Organize review around income taxes, VAT and other business taxes, estate and donor’s taxes, withholding, tax administration, remedies, invoicing, filing, and payment. Do not rely on undated rates, thresholds, or deadlines.',
          sourceIds: [sources.cpaleProgramSource.id, sources.nircSource.id, sources.trainSource.id, sources.easeOfPayingTaxesSource.id, sources.createSource.id, sources.createMoreSource.id, sources.digitalServicesVatSource.id],
        },
        {
          text: 'Regulatory Framework for Business Transactions (RFBT) applies statutes to legal fact patterns. Review obligations and contracts, business organizations, corporations and securities, secured transactions, insolvency, privacy, and other commercial laws included in the current syllabus.',
          sourceIds: [sources.cpaleProgramSource.id, sources.civilCodeSource.id, sources.revisedCorporationCodeSource.id, sources.securitiesRegulationCodeSource.id, sources.friaSource.id, sources.personalPropertySecuritySource.id, sources.dataPrivacySource.id],
        },
      ],
      findings: [
        {
          text: 'FAR problems test the application of reporting requirements, not just account-name recall.',
          explanation: 'For each fact pattern, identify the relevant standard, recognition and measurement basis, presentation, and disclosure. Use the PFRS version effective for the question; IFRS materials are a reference, not a substitute for Philippine adoption and exam coverage.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          text: 'AFAR requires clear ownership, acquisition-date, and reporting-period schedules.',
          explanation: 'For combinations and consolidated statements, determine the acquirer and relevant control, then reconcile consideration, identifiable balances, non-controlling interests, and intragroup eliminations using the applicable standards.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          text: 'MS asks which costs and measures are relevant to a decision.',
          explanation: 'Separate future amounts that differ between alternatives from sunk costs and costs common to all alternatives. State the decision objective and any assumptions, such as a relevant range or fixed product mix.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          text: 'An audit is designed to obtain reasonable assurance, not a guarantee.',
          explanation: 'The auditor assesses risks of material misstatement and obtains sufficient appropriate evidence to reduce audit risk to an acceptably low level before expressing an opinion.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          text: 'Tax answers should show classification before computation.',
          explanation: 'Establish the taxpayer, taxable period, income or transaction type, applicable regime, tax base, and available deductions or credits before applying the current rate and checking compliance rules.',
          sourceIds: [sources.nircSource.id, sources.trainSource.id],
        },
        {
          text: 'Tax law coverage must include post-NIRC amendments and implementation rules.',
          explanation: 'The TRAIN, CREATE, Ease of Paying Taxes, VAT on Digital Services, and CREATE MORE Acts amended different parts of the tax framework. Check the law and applicable BIR issuances in force for the stated period instead of assuming the original Code text is current.',
          sourceIds: [sources.trainSource.id, sources.createSource.id, sources.easeOfPayingTaxesSource.id, sources.digitalServicesVatSource.id, sources.createMoreSource.id],
        },
        {
          text: 'EOPT is a tax-administration reform, while the NIRC remains the central statutory framework.',
          explanation: 'Use the Ease of Paying Taxes Act to identify its amendments and use the amended Code and current implementing issuances for filing, invoicing, classification, and compliance details.',
          sourceIds: [sources.nircSource.id, sources.easeOfPayingTaxesSource.id],
        },
        {
          text: 'The 2024 tax laws added material topics to current Philippine tax review.',
          explanation: 'Republic Act No. 12023 addresses VAT on digital services, while Republic Act No. 12066 amends corporate income-tax and incentives provisions. Learn the scope and effective rules from the Acts and current BIR issuances; do not infer rates or effectivity dates from a summary.',
          sourceIds: [sources.digitalServicesVatSource.id, sources.createMoreSource.id],
        },
        {
          text: 'RFBT contract questions commonly test the required elements and the facts affecting consent.',
          explanation: 'The Civil Code identifies consent, a determinate object, and cause as essential requisites of a contract. Apply relevant rules on capacity, vitiated consent, form, and the specific contract type before reaching a conclusion.',
          sourceIds: [sources.civilCodeSource.id],
        },
        {
          text: 'The Revised Corporation Code distinguishes stock and nonstock corporations.',
          explanation: 'Stock corporations have capital stock divided into shares and may distribute dividends or surplus profits based on shares. Nonstock corporations do not meet that statutory stock-corporation definition.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          text: 'Separate corporate personality is a starting rule, not an answer to every liability question.',
          explanation: 'The Revised Corporation Code defines a corporation as a juridical entity created by operation of law. Apply the specific statutory provisions and facts before deciding whether a shareholder, director, or officer may have personal liability.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          text: 'RFBT also spans securities regulation, secured credit, and insolvency.',
          explanation: 'The Securities Regulation Code addresses investor protection and fair disclosure; the Personal Property Security Act supplies a framework for security interests in personal property; and FRIA addresses rehabilitation or liquidation of financially distressed debtors.',
          sourceIds: [sources.securitiesRegulationCodeSource.id, sources.personalPropertySecuritySource.id, sources.friaSource.id],
        },
      ],
      keyTerms: [
        {
          term: 'Five-step revenue model',
          definition: 'A framework for recognizing revenue by identifying a customer contract, identifying performance obligations, determining and allocating the transaction price, and recognizing revenue when or as obligations are satisfied.',
          explanation: 'Apply the steps to the contract facts and the applicable Philippine-adopted standard.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          term: 'Control of an investee',
          definition: 'Under IFRS 10, control requires power over the investee, exposure or rights to variable returns, and the ability to use power to affect those returns.',
          explanation: 'Assess all elements together; ownership percentage alone is not the complete analysis.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          term: 'Consolidated financial statements',
          definition: 'Financial statements that present a parent and its subsidiaries as a single economic entity.',
          explanation: 'Consolidation requires the applicable control assessment and adjustments, including elimination of intragroup balances and transactions.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          term: 'Cost-volume-profit analysis',
          definition: 'Analysis of how selling price, volume, variable cost, fixed cost, and sales mix affect contribution and profit.',
          explanation: 'For a single product, break-even units equal fixed costs divided by contribution margin per unit, subject to the model’s assumptions.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          term: 'Relevant cost',
          definition: 'A future cost that differs between decision alternatives.',
          explanation: 'A sunk cost or a future cost that is identical under all alternatives does not change an incremental comparison.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          term: 'Net present value (NPV)',
          definition: 'The present value of expected cash inflows less the present value of expected cash outflows, discounted using the rate appropriate to the analysis.',
          explanation: 'A positive NPV indicates value above the investment cost at the chosen discount rate under the cash-flow assumptions.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          term: 'Audit risk',
          definition: 'The risk that the auditor expresses an inappropriate opinion when the financial statements are materially misstated.',
          explanation: 'The auditor assesses risk and designs procedures to obtain sufficient appropriate evidence and reduce audit risk.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          term: 'Reasonable assurance',
          definition: 'A high, but not absolute, level of assurance obtained in a financial-statement audit.',
          explanation: 'Inherent limitations mean an audit cannot guarantee that every material misstatement will be detected.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          term: 'Sufficient appropriate audit evidence',
          definition: 'Evidence sufficient in quantity and appropriate in relevance and reliability to support the auditor’s conclusions.',
          explanation: 'More evidence does not necessarily compensate for evidence that is not relevant or reliable.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          term: 'Tax base',
          definition: 'The amount or measure to which the applicable tax rule is applied.',
          explanation: 'Identify the taxpayer, period, transaction, and current legal rule before computing a liability.',
          sourceIds: [sources.nircSource.id],
        },
        {
          term: 'Ease of Paying Taxes Act',
          definition: 'Republic Act No. 11976, which introduces administrative tax reforms and amends provisions of the National Internal Revenue Code.',
          explanation: 'Study its statutory amendments and current implementing rules rather than relying on summaries of the original Code.',
          sourceIds: [sources.easeOfPayingTaxesSource.id],
        },
        {
          term: 'VAT on digital services',
          definition: 'A Philippine VAT topic amended by Republic Act No. 12023, which amended the National Internal Revenue Code provisions on digital services.',
          explanation: 'Determine the transaction, parties, applicable statutory rules, and current BIR implementation; do not assume all digital transactions receive identical treatment.',
          sourceIds: [sources.digitalServicesVatSource.id],
        },
        {
          term: 'Obligation',
          definition: 'A juridical necessity to give, to do, or not to do, as defined in the Civil Code.',
          explanation: 'For a problem, identify the source of the obligation and the rules governing performance, breach, and extinguishment.',
          sourceIds: [sources.civilCodeSource.id],
        },
        {
          term: 'Essential requisites of a contract',
          definition: 'Consent of the contracting parties, a determinate object, and cause of the obligation.',
          explanation: 'The Civil Code’s general requisites do not replace additional requirements or formalities that may apply to a particular contract.',
          sourceIds: [sources.civilCodeSource.id],
        },
        {
          term: 'Stock corporation',
          definition: 'A corporation with capital stock divided into shares and authorized to distribute dividends or surplus profits based on shares held.',
          explanation: 'The Revised Corporation Code defines nonstock corporations by contrast.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          term: 'Separate juridical personality',
          definition: 'The corporation’s legal personality is distinct from that of its shareholders.',
          explanation: 'Apply the Revised Corporation Code and relevant facts to any question about personal liability or exceptions.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          term: 'Financial rehabilitation and insolvency',
          definition: 'Legal processes for addressing financially distressed debtors through rehabilitation or, when appropriate, liquidation.',
          explanation: 'FRIA emphasizes timely and fair proceedings, creditor rights, and orderly treatment of claims.',
          sourceIds: [sources.friaSource.id],
        },
      ],
      questions: [
        {
          question: 'What are the five steps in IFRS 15’s revenue-recognition model?',
          answer: 'Identify the contract, identify performance obligations, determine the transaction price, allocate it to the obligations, and recognize revenue when or as an obligation is satisfied.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          question: 'How does IAS 2 generally measure inventories at the reporting date?',
          answer: 'At the lower of cost and net realisable value, applying the standard’s measurement requirements.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          question: 'What three elements make up control of an investee under IFRS 10?',
          answer: 'Power over the investee, exposure or rights to variable returns, and the ability to use that power to affect the returns.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          question: 'Why are intragroup balances and transactions eliminated in consolidated financial statements?',
          answer: 'The group is presented as a single economic entity, so intragroup activity is removed rather than presented as activity with outside parties.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          question: 'What is the purpose of identifying an acquisition date and acquirer in a business combination?',
          answer: 'They establish the basis for applying the acquisition method and recognizing and measuring the combination under the applicable reporting standard.',
          sourceIds: [sources.financialReportingSource.id],
        },
        {
          question: 'What is contribution margin per unit?',
          answer: 'Selling price per unit less variable cost per unit.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          question: 'A product sells for ₱500, has variable cost of ₱300 per unit, and fixed costs are ₱40,000. What is the break-even volume in units under a single-product CVP model?',
          answer: '200 units: ₱40,000 fixed costs divided by ₱200 contribution margin per unit. This assumes the model’s relevant-range and linearity assumptions hold.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          question: 'What makes a cost relevant to a choice between alternatives?',
          answer: 'It is a future cost that differs between the alternatives being compared.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          question: 'What does a positive net present value indicate under the assumptions used in an investment analysis?',
          answer: 'The present value of expected inflows exceeds the present value of outflows at the selected discount rate.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          question: 'Why can a flexible budget be more useful than a static budget for performance analysis?',
          answer: 'It adjusts budget expectations to the actual activity level, helping distinguish activity-volume effects from differences in rates, usage, or spending.',
          sourceIds: [sources.managementAccountingSource.id],
        },
        {
          question: 'Does a financial-statement audit provide absolute assurance?',
          answer: 'No. It provides reasonable assurance, which is high but not absolute, because audits have inherent limitations.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          question: 'How should an auditor use assessed risks of material misstatement?',
          answer: 'Use them to design and perform responsive audit procedures and obtain sufficient appropriate evidence.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          question: 'How does a test of controls differ from a substantive procedure?',
          answer: 'A test of controls evaluates whether a control operated effectively. A substantive procedure is designed to detect material misstatements at the assertion level.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          question: 'What is the difference between sufficiency and appropriateness of audit evidence?',
          answer: 'Sufficiency concerns quantity; appropriateness concerns relevance and reliability.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          question: 'When may an auditor need to modify the opinion under the auditing standards?',
          answer: 'When the financial statements are materially misstated, or the auditor cannot obtain sufficient appropriate evidence and the possible effects may be material, applying the standard’s requirements.',
          sourceIds: [sources.auditingStandardsSource.id],
        },
        {
          question: 'Which national internal revenue tax categories are expressly listed in the Ease of Paying Taxes Act’s amendment to the NIRC?',
          answer: 'Income tax; estate and donor’s taxes; VAT; other percentage taxes; excise taxes; documentary stamp taxes; and other taxes later imposed and collected by the BIR.',
          sourceIds: [sources.easeOfPayingTaxesSource.id],
        },
        {
          question: 'What is the Ease of Paying Taxes Act?',
          answer: 'Republic Act No. 11976, an Act introducing administrative tax reforms and amending provisions of the National Internal Revenue Code.',
          sourceIds: [sources.easeOfPayingTaxesSource.id],
        },
        {
          question: 'What Philippine tax-law topic did Republic Act No. 12023 specifically address?',
          answer: 'It amended the National Internal Revenue Code provisions concerning value-added tax, including the treatment of digital services. Apply the Act and current BIR implementation to the facts.',
          sourceIds: [sources.digitalServicesVatSource.id],
        },
        {
          question: 'What broad areas did the CREATE Act reform?',
          answer: 'It reformed the corporate income-tax and tax-incentives system by amending the National Internal Revenue Code and adding provisions on incentives.',
          sourceIds: [sources.createSource.id],
        },
        {
          question: 'What should you verify before using a tax rate, threshold, exemption, or filing deadline in an exam answer?',
          answer: 'Check the applicable law and BIR issuances effective for the taxpayer, transaction, taxable period, and stated exam coverage date.',
          sourceIds: [sources.nircSource.id, sources.trainSource.id, sources.createSource.id, sources.easeOfPayingTaxesSource.id, sources.createMoreSource.id],
        },
        {
          question: 'What is a sound order of analysis for a Philippine tax computation?',
          answer: 'Identify the taxpayer and period, classify the income or transaction, determine the governing current rule and tax base, compute the amount, and consider applicable credits, exceptions, and compliance requirements.',
          sourceIds: [sources.nircSource.id],
        },
        {
          question: 'Under Article 1156 of the Civil Code, what may an obligation require a debtor to do?',
          answer: 'To give something, to do something, or not to do something.',
          sourceIds: [sources.civilCodeSource.id],
        },
        {
          question: 'What are the three essential requisites of a contract under Article 1318 of the Civil Code?',
          answer: 'Consent of the contracting parties, a determinate object, and cause of the obligation.',
          sourceIds: [sources.civilCodeSource.id],
        },
        {
          question: 'How does the Revised Corporation Code distinguish a stock corporation from a nonstock corporation?',
          answer: 'A stock corporation has capital stock divided into shares and is authorized to distribute dividends or surplus profits based on shares. Other corporations are nonstock.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          question: 'What is the general statutory definition of a corporation under the Revised Corporation Code?',
          answer: 'An artificial being created by operation of law, with the right of succession and powers, attributes, and properties expressly authorized by law or incidental to its existence.',
          sourceIds: [sources.revisedCorporationCodeSource.id],
        },
        {
          question: 'Name two objectives stated in the Securities Regulation Code’s declaration of policy.',
          answer: 'Examples include investor protection and full and fair disclosure about securities; the law also addresses capital-market development and fraudulent or manipulative practices.',
          sourceIds: [sources.securitiesRegulationCodeSource.id],
        },
        {
          question: 'What does FRIA provide for financially distressed debtors?',
          answer: 'Rehabilitation or liquidation proceedings intended to address competing claims and property rights in a timely and orderly way, with due regard for creditor rights and equitable treatment.',
          sourceIds: [sources.friaSource.id],
        },
        {
          question: 'What is the central purpose of the Personal Property Security Act?',
          answer: 'To establish a modern legal framework for security interests in personal property, including their creation, perfection, priority, registration, and enforcement.',
          sourceIds: [sources.personalPropertySecuritySource.id],
        },
        {
          question: 'Which steps in a security interest’s life cycle are expressly addressed by the Personal Property Security Act?',
          answer: 'Creation, perfection, determination of priority, notice registration, and enforcement.',
          sourceIds: [sources.personalPropertySecuritySource.id],
        },
        {
          question: 'What should a reviewer do when a business-law question involves personal information?',
          answer: 'Identify whether the Data Privacy Act and its current implementing rules apply, then analyze the facts and the parties’ roles rather than assuming business use removes privacy duties.',
          sourceIds: [sources.dataPrivacySource.id],
        },
      ],
    })
  }
}

export default new CpaleReviewer()
