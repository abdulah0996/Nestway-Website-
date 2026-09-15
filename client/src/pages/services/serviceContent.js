import { serviceImages } from '../../assets/editorialImages.js';

const sharedProcess = [
  { title: 'Consultation', text: 'Clarify your goal, priorities and preferred timeline.' },
  { title: 'Assessment', text: 'Review your profile against the relevant pathway criteria.' },
  { title: 'Documentation', text: 'Build an organized evidence set with careful quality checks.' },
  { title: 'Application', text: 'Prepare and submit the application through the appropriate channel.' },
  { title: 'Decision', text: 'Stay informed through updates, requests and the final outcome.' },
];

export const serviceContent = {
  'study-visa': {
    title: 'Study Visa', kicker: 'Education without borders', position: '2%', imageUrl: serviceImages['study-visa'],
    shortDescription: 'Turn the right admission into a confident international education journey.',
    overview: 'Studying abroad is more than an application. We help connect your academic history, destination, course choice and visa evidence into one coherent plan.',
    eligibility: ['A genuine academic objective', 'Admission or a realistic institution shortlist', 'Suitable previous qualifications', 'A credible financial plan', 'Readiness to meet language requirements'],
    requirements: ['Valid passport and identity documents', 'Academic transcripts and certificates', 'Institution offer or enrolment evidence', 'Financial capacity evidence', 'Language test results where required', 'Statement of study intent and supporting documents'],
    benefits: ['Course and destination alignment', 'A structured evidence strategy', 'Clear milestones from admission to visa', 'Support for accompanying family considerations'],
    process: sharedProcess,
    faqs: [
      ['When should I begin?', 'Starting early creates more room for institution selection, documentation and visa processing. Your ideal timeline depends on your intake and destination.'],
      ['Can I apply with a study gap?', 'A study gap does not automatically prevent an application. Its context, evidence and connection to your proposed course should be carefully explained.'],
      ['Do you help with course selection?', 'Yes. Course and institution choices can be reviewed alongside your academic profile and longer-term goals.'],
    ],
  },
  'visit-visa': {
    title: 'Visit Visa', kicker: 'Travel with clarity', position: '29%', imageUrl: serviceImages['visit-visa'],
    shortDescription: 'A carefully prepared visitor application that makes the purpose of your journey clear.',
    overview: 'A strong visitor application presents a credible purpose, practical travel plan and clear reasons to return home. We help organize those elements without overcomplicating your story.',
    eligibility: ['A clear and genuine reason to travel', 'Sufficient funds for the proposed visit', 'A practical itinerary and intended duration', 'Evidence of ties to your home country', 'Ability to meet health or character requirements where applicable'],
    requirements: ['Passport and travel history', 'Purpose-of-visit documents', 'Financial statements or sponsorship evidence', 'Employment, business or study evidence', 'Accommodation and itinerary details', 'Invitation documents where relevant'],
    benefits: ['Purpose-led application planning', 'Evidence reviewed for consistency', 'Clear sponsor and funding presentation', 'Preparation for additional information requests'],
    process: sharedProcess,
    faqs: [
      ['Is confirmed travel required before applying?', 'Requirements vary by destination. It is generally wise to understand the application guidance before making non-refundable arrangements.'],
      ['Can a family member sponsor my visit?', 'Sponsorship may be possible depending on the destination and circumstances. Both the sponsor’s capacity and your own circumstances can be relevant.'],
      ['What if I have a previous refusal?', 'A previous refusal should be reviewed carefully so the new application addresses the actual concerns rather than simply repeating the same evidence.'],
    ],
  },
  'skilled-immigration': {
    title: 'Skilled Immigration', kicker: 'Experience that travels', position: '53%', imageUrl: serviceImages['skilled-immigration'],
    shortDescription: 'Transform your qualifications and professional experience into a credible migration strategy.',
    overview: 'Skilled migration involves more than reaching a points score. Occupation fit, assessing authorities, English ability, regional options and timing all shape the pathway.',
    eligibility: ['An occupation relevant to an available pathway', 'Recognized qualifications or demonstrable experience', 'Suitable language ability', 'Ability to satisfy age and character criteria', 'A competitive profile for the intended program'],
    requirements: ['Passport and civil documents', 'Qualifications and academic records', 'Detailed employment references', 'Language test evidence', 'Skills assessment documents', 'Licensing or registration evidence where relevant'],
    benefits: ['Occupation and pathway mapping', 'Points and profile scenario planning', 'Skills assessment preparation', 'State, regional or employer route considerations'],
    process: sharedProcess,
    faqs: [
      ['Do I need a job offer?', 'Some skilled pathways require employer involvement while others may not. The answer depends on your occupation, destination and selected route.'],
      ['What is a skills assessment?', 'It is an evaluation by an authorized body of whether your qualifications and experience meet the standard for a nominated occupation.'],
      ['Can I improve my profile?', 'Language scores, experience, qualifications, nomination and partner factors may affect some pathways. A profile assessment can identify realistic levers.'],
    ],
  },
  'business-immigration': {
    title: 'Business Immigration', kicker: 'Ambition, globally positioned', position: '82%', imageUrl: serviceImages['business-immigration'],
    shortDescription: 'Align your capital, commercial experience and international ambitions with the right market.',
    overview: 'Business and investor pathways require commercial credibility as well as capital. We help frame your background, source of funds and future plan as one carefully supported proposition.',
    eligibility: ['Relevant business ownership or senior management experience', 'A credible investment or business objective', 'Capacity to evidence lawful source of funds', 'A commercially realistic destination plan', 'Ability to meet program-specific financial criteria'],
    requirements: ['Business ownership and registration records', 'Audited accounts and tax documents', 'Asset and source-of-funds evidence', 'Management experience records', 'Business plan or investment proposal', 'Identity, character and supporting civil documents'],
    benefits: ['Market and pathway comparison', 'Source-of-funds evidence planning', 'Business narrative and document coordination', 'Family and long-term objective alignment'],
    process: sharedProcess,
    faqs: [
      ['How much investment is required?', 'Thresholds differ significantly by destination and program and can change. An assessment should use the current criteria for your preferred market.'],
      ['Must I actively manage the business?', 'Some routes expect active management while others focus on qualifying investment. Your intended role helps determine the appropriate pathway.'],
      ['Can my family be included?', 'Many programs provide options for eligible family members, subject to the specific route and individual requirements.'],
    ],
  },
};
