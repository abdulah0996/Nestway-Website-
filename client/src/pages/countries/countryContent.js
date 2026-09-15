import { countryImages } from '../../assets/editorialImages.js';

const process = [
  { title: 'Initial consultation', text: 'Clarify your destination, goals and preferred timeline.' },
  { title: 'Profile assessment', text: 'Review the factors that shape your realistic pathway options.' },
  { title: 'Documentation', text: 'Prepare a coherent evidence set with structured quality checks.' },
  { title: 'Application submission', text: 'Finalize and lodge through the appropriate official channel.' },
  { title: 'Visa decision', text: 'Navigate updates, further requests and the eventual outcome.' },
];

const commonPathways = [
  { name: 'Student Visa', detail: 'Education-led entry for eligible international students.' },
  { name: 'Work Visa', detail: 'Support for qualifying temporary employment routes.' },
  { name: 'Skilled Migration', detail: 'Skills-based options shaped by occupation and profile.' },
  { name: 'Business Options', detail: 'Commercial pathways for qualifying founders and investors.' },
  { name: 'Family & Visit', detail: 'Temporary visits and eligible family-connected options.' },
];

const baseRequirements = {
  eligibility: ['A genuine purpose aligned with the chosen visa', 'Ability to meet health and character criteria', 'A profile appropriate for the selected pathway'],
  documents: ['Valid identity and civil documents', 'Education or employment evidence', 'Pathway-specific supporting records'],
  language: ['Approved language testing where required', 'Results that meet the selected pathway threshold', 'Consistent evidence of study or professional readiness'],
  financial: ['Evidence of accessible funds where required', 'Clear and lawful source of funds', 'A realistic budget for application and relocation'],
};

const studyData = {
  australia: {
    intakes: [['February', 'The main intake for many undergraduate and postgraduate programs.'], ['July', 'A second major intake with broad program availability.'], ['November', 'A limited intake offered by selected institutions and programs.']],
    universities: [
      { name: 'University of Melbourne', city: 'Melbourne', popularPrograms: ['Business', 'Engineering', 'Health Sciences'] },
      { name: 'Monash University', city: 'Melbourne', popularPrograms: ['Information Technology', 'Pharmacy', 'Business'] },
      { name: 'UNSW Sydney', city: 'Sydney', popularPrograms: ['Engineering', 'Computer Science', 'Commerce'] },
    ],
  },
  'united-kingdom': {
    intakes: [['September', 'The primary intake with the widest selection of courses.'], ['January', 'A useful alternative for selected postgraduate and undergraduate programs.'], ['May', 'Limited availability at participating institutions.']],
    universities: [
      { name: 'University of Manchester', city: 'Manchester', popularPrograms: ['Business', 'Engineering', 'Social Sciences'] },
      { name: 'University of Birmingham', city: 'Birmingham', popularPrograms: ['Law', 'Computer Science', 'Health Sciences'] },
      { name: 'University of Glasgow', city: 'Glasgow', popularPrograms: ['Life Sciences', 'Education', 'Finance'] },
    ],
  },
  canada: {
    intakes: [['September', 'The principal intake across Canadian universities and colleges.'], ['January', 'A substantial winter intake for selected programs.'], ['May', 'A smaller intake with institution-specific availability.']],
    universities: [
      { name: 'University of Toronto', city: 'Toronto', popularPrograms: ['Computer Science', 'Business', 'Life Sciences'] },
      { name: 'University of British Columbia', city: 'Vancouver', popularPrograms: ['Engineering', 'Forestry', 'Economics'] },
      { name: 'McGill University', city: 'Montreal', popularPrograms: ['Medicine', 'Management', 'Science'] },
    ],
  },
  'new-zealand': {
    intakes: [['February', 'The main academic intake with wide program availability.'], ['July', 'A second major intake for many courses.'], ['Rolling or trimester', 'Selected institutions offer additional starts during the year.']],
    universities: [
      { name: 'University of Auckland', city: 'Auckland', popularPrograms: ['Engineering', 'Business', 'Health Sciences'] },
      { name: 'University of Otago', city: 'Dunedin', popularPrograms: ['Health Sciences', 'Business', 'Humanities'] },
      { name: 'Victoria University of Wellington', city: 'Wellington', popularPrograms: ['Law', 'Design', 'Public Policy'] },
    ],
  },
  malaysia: {
    intakes: [['February', 'A common start period for foundation and degree programs.'], ['July', 'A major mid-year intake at many institutions.'], ['September or October', 'Additional availability for selected programs and campuses.']],
    universities: [
      { name: 'Universiti Malaya', city: 'Kuala Lumpur', popularPrograms: ['Engineering', 'Business', 'Computer Science'] },
      { name: "Taylor's University", city: 'Subang Jaya', popularPrograms: ['Hospitality', 'Business', 'Design'] },
      { name: 'UCSI University', city: 'Kuala Lumpur', popularPrograms: ['Health Sciences', 'Engineering', 'Music'] },
    ],
  },
  europe: {
    intakes: [['September or October', 'The principal autumn intake across many European systems.'], ['January or February', 'A secondary intake available for selected courses and countries.'], ['Program-specific', 'Application periods differ by country, institution and qualification level.']],
    universities: [
      { name: 'University of Amsterdam', city: 'Amsterdam', popularPrograms: ['Economics', 'Social Sciences', 'Data Science'] },
      { name: 'Technical University of Munich', city: 'Munich', popularPrograms: ['Engineering', 'Technology', 'Natural Sciences'] },
      { name: 'University of Bologna', city: 'Bologna', popularPrograms: ['Business', 'Law', 'Humanities'] },
    ],
  },
};

const australia = {
  apiSlug: 'australia', name: 'Australia', kicker: 'Opportunity meets quality of life', position: '2%',
  imageUrl: countryImages.australia,
  introduction: 'Explore an education and migration landscape built around skills, study, enterprise and meaningful long-term possibilities.',
  overview: 'Australia offers multiple pathways for international students, skilled professionals, families and qualifying business applicants. The right route depends on your profile, timing and intended destination within the country.',
  reasons: [
    ['Education opportunities', 'A diverse higher-education sector with study options across major cities and regional communities.'],
    ['Work opportunities', 'Pathways can connect eligible graduates and skilled professionals with evolving workforce needs.'],
    ['Immigration benefits', 'Temporary and permanent options may form part of a carefully sequenced long-term plan.'],
    ['Lifestyle', 'Cosmopolitan cities, regional choice and an internationally connected way of life.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const uk = {
  apiSlug: 'united-kingdom', name: 'United Kingdom', kicker: 'Tradition with global momentum', position: '16%',
  imageUrl: countryImages['united-kingdom'],
  introduction: 'Build your next chapter in a globally connected destination known for education, enterprise and cultural reach.',
  overview: 'The United Kingdom brings together respected institutions, international business centres and a range of study, work, family and business routes. Careful planning helps align the visa with the purpose of your stay.',
  reasons: [
    ['Education opportunities', 'An established academic environment with varied programs and study formats.'],
    ['Work opportunities', 'International sectors and specialist roles can create routes for suitably qualified applicants.'],
    ['Immigration benefits', 'Clear visa categories support different stages of study, work and family life.'],
    ['Lifestyle', 'Historic communities, modern cities and direct access to a deeply international culture.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const canada = {
  apiSlug: 'canada', name: 'Canada', kicker: 'Space to build what comes next', position: '32%',
  imageUrl: countryImages.canada,
  introduction: 'Consider study, work and skills-led pathways within a diverse country shaped by regional opportunity.',
  overview: 'Canada combines federal and provincial immigration systems with study and temporary work options. A strong plan considers destination, occupation, language, experience and long-term intent together.',
  reasons: [
    ['Education opportunities', 'A broad selection of institutions and programs across distinct provinces and cities.'],
    ['Work opportunities', 'Regional labour needs and employer routes may shape options for eligible professionals.'],
    ['Immigration benefits', 'Federal and provincial programs create different ways to present a competitive profile.'],
    ['Lifestyle', 'Multicultural cities, close-knit communities and vast natural environments.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const usa = {
  apiSlug: 'united-states', name: 'United States', kicker: 'Think bigger. Move strategically.', position: '49%',
  introduction: 'Navigate education, business, employment and visitor options in one of the world’s most dynamic destinations.',
  imageUrl: countryImages['united-states'],
  overview: 'United States pathways are strongly tied to the specific purpose of travel and, for many categories, an institution, employer, family relationship or qualifying investment. Precision matters from the outset.',
  reasons: [
    ['Education opportunities', 'A vast range of institutions, disciplines and research environments.'],
    ['Work opportunities', 'Specialist employment routes can support qualifying talent and professional experience.'],
    ['Immigration benefits', 'Distinct temporary and permanent categories allow focused pathway planning.'],
    ['Lifestyle', 'Extraordinary regional variety, global industries and diverse communities.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const newZealand = {
  apiSlug: 'new-zealand', name: 'New Zealand', kicker: 'A future with room to breathe', position: '65%',
  imageUrl: countryImages['new-zealand'],
  introduction: 'Explore a destination where education, skilled work and an exceptional natural environment come together.',
  overview: 'New Zealand provides study, work, skilled and family-related possibilities for eligible applicants. Occupation, employer context, qualifications and location can all influence the route.',
  reasons: [
    ['Education opportunities', 'Internationally oriented study options in an approachable academic environment.'],
    ['Work opportunities', 'Skills and employer needs may create options across selected sectors and regions.'],
    ['Immigration benefits', 'Some temporary pathways can connect with longer-term residence planning.'],
    ['Lifestyle', 'Connected cities, smaller communities and renowned access to nature.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const malaysia = {
  apiSlug: 'malaysia', name: 'Malaysia', kicker: 'Asia’s connected education hub', position: '82%',
  imageUrl: countryImages.malaysia,
  introduction: 'Discover accessible international education and a culturally rich base at the heart of Southeast Asia.',
  overview: 'Malaysia attracts international students through local institutions and global university partnerships, alongside visitor, professional and long-stay possibilities suited to different goals.',
  reasons: [
    ['Education opportunities', 'International programs and cross-border university partnerships across varied disciplines.'],
    ['Work opportunities', 'A regional commercial hub with opportunities subject to employer and visa requirements.'],
    ['Immigration benefits', 'Study, professional and selected long-stay routes support different purposes.'],
    ['Lifestyle', 'Multicultural communities, urban convenience and access to Southeast Asia.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

const europe = {
  apiSlug: 'europe', name: 'Europe', kicker: 'Many cultures. One wider horizon.', position: '98%',
  imageUrl: countryImages.europe,
  introduction: 'Compare study, mobility and professional opportunities across a diverse group of European destinations.',
  overview: 'Europe is not one immigration system. Each country sets its own study, work, business and residence rules, while some short-stay arrangements span multiple destinations. Country selection comes first.',
  reasons: [
    ['Education opportunities', 'A wide range of languages, academic traditions, tuition models and specialist programs.'],
    ['Work opportunities', 'Country-specific skills needs and employer routes create varied professional options.'],
    ['Immigration benefits', 'Different national systems allow applicants to compare routes against their priorities.'],
    ['Lifestyle', 'Distinct cultures and cities connected by close regional mobility.'],
  ], pathways: commonPathways, requirements: baseRequirements, process,
};

export const countryContent = {
  australia: { ...australia, ...studyData.australia },
  uk: { ...uk, ...studyData['united-kingdom'] },
  'united-kingdom': { ...uk, ...studyData['united-kingdom'] },
  canada: { ...canada, ...studyData.canada },
  usa,
  'united-states': usa,
  'new-zealand': { ...newZealand, ...studyData['new-zealand'] },
  malaysia: { ...malaysia, ...studyData.malaysia },
  europe: { ...europe, ...studyData.europe },
};
