export const SYSTEM_ID = "magna";

export const CARACTERISTIQUES = Object.freeze({
  vig: {
    id: "vig",
    label: "MAGNA.CARACTERISTIQUE.vig.label",
    label_short: "VIG",
  },
  psi: {
    id: "psi",
    label: "MAGNA.CARACTERISTIQUE.psi.label",
    label_short: "PSI",
  },
  per: {
    id: "per",
    label: "MAGNA.CARACTERISTIQUE.per.label",
    label_short: "PER",
  },
  hab: {
    id: "hab",
    label: "MAGNA.CARACTERISTIQUE.hab.label",
    label_short: "HAB",
  },
  cha: {
    id: "cha",
    label: "MAGNA.CARACTERISTIQUE.cha.label",
    label_short: "CHA",
  },
  int: {
    id: "int",
    label: "MAGNA.CARACTERISTIQUE.int.label",
    label_short: "INT",
  },
  agi: {
    id: "agi",
    label: "MAGNA.CARACTERISTIQUE.agi.label",
    label_short: "AGI",
  },
  ins: {
    id: "ins",
    label: "MAGNA.CARACTERISTIQUE.ins.label",
    label_short: "INS",
  },
  vol: {
    id: "vol",
    label: "MAGNA.CARACTERISTIQUE.vol.label",
    label_short: "VOL",
  },
});

export const INDICES = Object.freeze({
  cac: {
    id: "cac",
    label: "MAGNA.INDICE.cac.label",
    label_short: "CAC",
  },
  cacpsi: {
    id: "cacpsi",
    label: "MAGNA.INDICE.cacpsi.label",
    label_short: "CAC PSI",
  },
  dist: {
    id: "dist",
    label: "MAGNA.INDICE.dist.label",
    label_short: "DIST",
  },
  distpsi: {
    id: "distpsi",
    label: "MAGNA.INDICE.distpsi.label",
    label_short: "DIST PSI",
  },
  ref: {
    id: "ref",
    label: "MAGNA.INDICE.ref.label",
    label_short: "REF",
  },
  refpsi: {
    id: "refpsi",
    label: "MAGNA.INDICE.refpsi.label",
    label_short: "REF PSI",
  },
});

export const COMPETENCES = Object.freeze({
  acrobaties: {
    id: "acrobaties",
    label: "MAGNA.COMPETENCE.acrobaties.label",
    defaultCarac: "agi",
  },
  athletisme: {
    id: "athletisme",
    label: "MAGNA.COMPETENCE.athletisme.label",
    defaultCarac: "agi",
  },
  bluff: {
    id: "bluff",
    label: "MAGNA.COMPETENCE.bluff.label",
    defaultCarac: "cha",
  },
  camouflage: {
    id: "camouflage",
    label: "MAGNA.COMPETENCE.camouflage.label",
    defaultCarac: "int",
  },
  clairvoyance: {
    id: "clairvoyance",
    label: "MAGNA.COMPETENCE.clairvoyance.label",
    defaultCarac: "ins",
  },
  crochetage: {
    id: "crochetage",
    label: "MAGNA.COMPETENCE.crochetage.label",
    defaultCarac: "hab",
  },
  derober: {
    id: "derober",
    label: "MAGNA.COMPETENCE.derober.label",
    defaultCarac: "hab",
  },
  discretion: {
    id: "discretion",
    label: "MAGNA.COMPETENCE.discretion.label",
    defaultCarac: "agi",
  },
  empathie: {
    id: "empathie",
    label: "MAGNA.COMPETENCE.empathie.label",
    defaultCarac: "ins",
  },
  filature: {
    id: "filature",
    label: "MAGNA.COMPETENCE.filature.label",
    defaultCarac: "per",
  },
  forcer: {
    id: "forcer",
    label: "MAGNA.COMPETENCE.forcer.label",
    defaultCarac: "vig",
  },
  fouille: {
    id: "fouille",
    label: "MAGNA.COMPETENCE.fouille.label",
    defaultCarac: "hab",
  },
  interroger: {
    id: "interroger",
    label: "MAGNA.COMPETENCE.interroger.label",
    defaultCarac: "cha",
  },
  intimider: {
    id: "intimider",
    label: "MAGNA.COMPETENCE.intimider.label",
    defaultCarac: "cha",
  },
  jeux: {
    id: "jeux",
    label: "MAGNA.COMPETENCE.jeux.label",
    defaultCarac: "ins",
  },
  memoire: {
    id: "memoire",
    label: "MAGNA.COMPETENCE.memoire.label",
    defaultCarac: "int",
  },
  observation: {
    id: "observation",
    label: "MAGNA.COMPETENCE.observation.label",
    defaultCarac: "per",
  },
  soins: {
    id: "soins",
    label: "MAGNA.COMPETENCE.soins.label",
    defaultCarac: "per",
  },
  resistance: {
    id: "resistance",
    label: "MAGNA.COMPETENCE.resistance.label",
    defaultCarac: "vig",
  },
  seduction: {
    id: "seduction",
    label: "MAGNA.COMPETENCE.seduction.label",
    defaultCarac: "cha",
  },
  selfcontrol: {
    id: "selfcontrol",
    label: "MAGNA.COMPETENCE.selfcontrol.label",
    defaultCarac: "vol",
  },
  serenseigner: {
    id: "serenseigner",
    label: "MAGNA.COMPETENCE.serenseigner.label",
    defaultCarac: "cha",
  },
  sinformer: {
    id: "sinformer",
    label: "MAGNA.COMPETENCE.sinformer.label",
    defaultCarac: "int",
  },
  survie: {
    id: "survie",
    label: "MAGNA.COMPETENCE.survie.label",
    defaultCarac: "ins",
  },
});

export const COMPETENCES_COMBAT = {
  mainsnues: {
    id: "mainsnues",
    label: "MAGNA.COMPETENCE_COMBAT.mainsnues.label",
    defaultCarac: "vig",
    defaultIndice: "cac",
  },
  armeblanche: {
    id: "armeblanche",
    label: "MAGNA.COMPETENCE_COMBAT.armeblanche.label",
    defaultCarac: "hab",
    defaultIndice: "cac",
  },
  armefeu: {
    id: "armefeu",
    label: "MAGNA.COMPETENCE_COMBAT.armefeu.label",
    defaultCarac: "hab",
    defaultIndice: "dist",
  },
  armelourde: {
    id: "armelourde",
    label: "MAGNA.COMPETENCE_COMBAT.armelourde.label",
    defaultCarac: "hab",
    defaultIndice: "dist",
  },
  esquive: {
    id: "esquive",
    label: "MAGNA.COMPETENCE_COMBAT.esquive.label",
    defaultCarac: "agi",
    defaultIndice: "ref",
  },
  parade: {
    id: "parade",
    label: "MAGNA.COMPETENCE_COMBAT.parade.label",
    defaultCarac: "vig",
    defaultIndice: "ref",
  },
};

export const COMPETENCES_SPE = Object.freeze({
  artisanats: {
    id: "artisanats",
    defaultCarac: "hab",
  },
  connaissances: {
    id: "connaissances",
    defaultCarac: "int",
  },
  langues: {
    id: "langues",
    defaultCarac: "int",
  },
  pilotage: {
    id: "pilotage",
    defaultCarac: "hab",
  },
});

export const DOMAINES = Object.freeze({
  amplification: {
    id: "amplification",
    label: "L’Amplification",
  },
  celerite: {
    id: "celerite",
    label: "La Célérité",
  },
  comunication: {
    id: "comunication",
    label: "La Communication",
  },
  connaissance: {
    id: "connaissance",
    label: "La Connaissance",
  },
  destin: {
    id: "destin",
    label: "Le Destin",
  },
  elements: {
    id: "elements",
    label: "Les Éléments",
  },
  force: {
    id: "force",
    label: "La Force",
  },
  gravite: {
    id: "gravite",
    label: "La Gravité",
  },
  infections: {
    id: "infections",
    label: "Les Infections",
  },
  invisible: {
    id: "invisible",
    label: "L’Invisible",
  },
  langage: {
    id: "langage",
    label: "Le Langage",
  },
  lumiere: {
    id: "lumiere",
    label: "La Lumière",
  },
  magnetisme: {
    id: "magnetisme",
    label: "Le Magnétisme",
  },
  matiere: {
    id: "matiere",
    label: "La Matière",
  },
  memoire: {
    id: "memoire",
    label: "La Mémoire",
  },
  mimetisme: {
    id: "mimetisme",
    label: "Le Mimétisme",
  },
  mort: {
    id: "mort",
    label: "La Mort ",
  },
  ombre: {
    id: "ombre",
    label: "L’Ombre ",
  },
  precognition: {
    id: "precognition",
    label: "La Précognition",
  },
  sceaux: {
    id: "sceaux",
    label: "Les Sceaux",
  },
  sens: {
    id: "sens",
    label: "Les Sens",
  },
  technologies: {
    id: "technologies",
    label: "Les Technologies",
  },
  temps: {
    id: "temps",
    label: "Le Temps",
  },
  transformation: {
    id: "transformation",
    label: "La Transformation",
  },
  ubiquite: {
    id: "ubiquite",
    label: "L’Ubiquité",
  },
  vide: {
    id: "vide",
    label: "Le Vide",
  },
  vie: {
    id: "vie",
    label: "La Vitalité",
  },
  vivant: {
    id: "vivant",
    label: "Le Vivant",
  },
});

export const DIFFICULTES = Object.freeze({
  tresdifficile: {
    id: "difficile",
    label: "MAGNA.DIFFICULTE.tresdifficile",
    modificateur: -10,
  },
  difficile: {
    id: "difficile",
    label: "MAGNA.DIFFICULTE.difficile",
    modificateur: -5,
  },
  normale: {
    id: "normale",
    label: "MAGNA.DIFFICULTE.normale",
    modificateur: 0,
  },
  facile: {
    id: "facile",
    label: "MAGNA.DIFFICULTE.facile",
    modificateur: 5,
  },
});

export const CONTRECOUPS = Object.freeze({
  duree1: {
    id: "duree1",
    label: "Quelques secondes",
    couppouv1: 1,
    couppouv2: 1,
    couppouv3: 0,
  },
  duree2: {
    id: "duree2",
    label: "Environ 1 minute",
    couppouv1: 2,
    couppouv2: 1,
    couppouv3: 1,
  },
  duree3: {
    id: "duree3",
    label: "Environ 3 minutes",
    couppouv1: 3,
    couppouv2: 2,
    couppouv3: 1,
  },
  duree4: {
    id: "duree4",
    label: "Environ 5 minutes",
    couppouv1: 4,
    couppouv2: 3,
    couppouv3: 2,
  },
  duree5: {
    id: "duree5",
    label: "Environ 10 minutes",
    couppouv1: 8,
    couppouv2: 6,
    couppouv3: 4,
  },
  duree6: {
    id: "duree6",
    label: "Environ 15 minutes",
    couppouv1: 12,
    couppouv2: 9,
    couppouv3: 6,
  },
  duree7: {
    id: "duree7",
    label: "Environ 30 minutes",
    couppouv1: 24,
    couppouv2: 18,
    couppouv3: 12,
  },
  duree8: {
    id: "duree8",
    label: "Environ 1 heure",
    couppouv1: 48,
    couppouv2: 36,
    couppouv3: 24,
  },
});

export const NOAURA_LIGHTING = Object.freeze({
  alpha: 0.5,
  angle: 360,
  animation: { speed: 5, intensity: 5, reverse: false, type: null },
  attenuation: 0.5,
  bright: 0,
  color: null,
  coloration: 1,
  contrast: 0,
  darkness: { min: 0, max: 1 },
  dim: 0,
  luminosity: 0.5,
  saturation: 0,
  shadows: 0,
});

export const PSIAURA_LIGHTING = Object.freeze({
  alpha: 0.5,
  angle: 360,
  animation: { type: "emanation", speed: 7, intensity: 3, reverse: false },
  attenuation: 0.5,
  bright: 1,
  color: "#c0c0c0",
  coloration: 9,
  contrast: 0,
  darkness: { min: 0, max: 1 },
  dim: 0.5,
  luminosity: 0.6,
  saturation: 0,
  shadows: 0,
});

export const CAR_IND_MERGE = foundry.utils.deepClone(CARACTERISTIQUES);
foundry.utils.mergeObject(CAR_IND_MERGE, INDICES, { insertKeys: true });

export const ROLLTYPE = Object.freeze({
  retracter: "retracter",
  deployer: "deployer",
  competence: "competence",
  pouvoir: "pouvoir",
  normal: "normal",
  arme: "arme"
});

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  id: SYSTEM_ID,
  DIFFICULTES,
  DOMAINES,
  CARACTERISTIQUES,
  COMPETENCES,
  COMPETENCES_COMBAT,
  COMPETENCES_SPE,
  INDICES,
  CONTRECOUPS,
  NOAURA_LIGHTING,
  PSIAURA_LIGHTING,
  CAR_IND_MERGE,
  ROLLTYPE,
};
