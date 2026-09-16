import nestwayLogo from './nestway-logo.jpeg';

const editorialUrl = (photoId, width = 1800) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=82`;

export const serviceImages = {
  'study-visa': editorialUrl('photo-1523240795612-9a054b0db644'),
  'visit-visa': editorialUrl('photo-1436491865332-7a61a109cc05'),
  'skilled-immigration': editorialUrl('photo-1521737711867-e3b97375f902'),
  'business-immigration': editorialUrl('photo-1556761175-b413da4baf72'),
};

export const countryImages = {
  australia: editorialUrl('photo-1506973035872-a4ec16b8e8d9'),
  'united-kingdom': editorialUrl('photo-1513635269975-59663e0ac1ad'),
  canada: editorialUrl('photo-1503614472-8c93d56e92ce'),
  'united-states': editorialUrl('photo-1485738422979-f5c462d49f74'),
  'new-zealand': editorialUrl('photo-1469521669194-babb45599def'),
  malaysia: editorialUrl('photo-1596422846543-75c6fc197f07'),
  europe: editorialUrl('photo-1499856871958-5b9627545d1a'),
};

export const resourceImages = {
  study: editorialUrl('photo-1523050854058-8df90110c9f1', 1200),
  destinations: editorialUrl('photo-1488646953014-85cb44e25828', 1200),
  documents: editorialUrl('photo-1450101499163-c8848c66ca85', 1200),
};

export const trainingImages = {
  IELTS: editorialUrl('photo-1434030216411-0b793f4b4173', 1200),
  TOEFL: editorialUrl('photo-1456513080510-7bf3a84b82f8', 1200),
  OET: editorialUrl('photo-1576091160399-112ba8d25d1d', 1200),
  CT: editorialUrl('photo-1543286386-713bdd548da4', 1200),
};

export const brandAssets = {
  logo: nestwayLogo,
};
