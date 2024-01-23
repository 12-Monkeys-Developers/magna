export const SYSTEM_ID = "magna";

export const CARACTERISTIQUES = Object.freeze({
    vig : {
        id: "vig",
        label: "MAGNA.CARACTERISTIQUE.vig.label",
        label_short: "VIG",
    },
    agi: {
        id: "agi",
        label: "MAGNA.CARACTERISTIQUE.agi.label",
        label_short: "AGI",
    },
    hab: {
        id: "hab",
        label: "MAGNA.CARACTERISTIQUE.hab.label",
        label_short: "HAB",
    },
    per:{
        id: "per",
        label: "MAGNA.CARACTERISTIQUE.per.label",
        label_short: "PER",
    },
    vol:{
        id: "vol",
        label: "MAGNA.CARACTERISTIQUE.vol.label",
        label_short: "VOL",
    },
    int:{
        id: "int",
        label: "MAGNA.CARACTERISTIQUE.int.label",
        label_short: "INT",
    },
    chr:{
        id: "chr",
        label: "MAGNA.CARACTERISTIQUE.chr.label",
        label_short: "CHR",
    },
    ins:{
        id: "ins",
        label: "MAGNA.CARACTERISTIQUE.ins.label",
        label_short: "INS",
    },
    psi:{
        id: "psi",
        label: "MAGNA.CARACTERISTIQUE.psi.label",
        label_short: "PSI",
    }
});

export const INDICES = Object.freeze({
    cac : {
        id: "cac",
        label: "MAGNA.INDICE.cac.label",
        label_short: "CAC",
    },
    dist : {
        id: "dist",
        label: "MAGNA.INDICE.dist.label",
        label_short: "DIST",
    },
    ref : {
        id: "ref",
        label: "MAGNA.INDICE.ref.label",
        label_short: "REF",
    },
    cacpsi : {
        id: "cacpsi",
        label: "MAGNA.INDICE.cacpsi.label",
        label_short: "CAC PSI",
    },
    distpsi : {
        id: "distpsi",
        label: "MAGNA.INDICE.distpsi.label",
        label_short: "DIST PSI",
    },
    refpsi : {
        id: "refpsi",
        label: "MAGNA.INDICE.refpsi.label",
        label_short: "REF PSI",
    }
});

export const COMPETENCES = Object.freeze({
    acrobaties : {
        id: "acrobaties",
        label: "MAGNA.COMPETENCE.acrobaties.label",
        defaultCarac:"agi"
    },
    athletisme : {
        id: "athletisme",
        label: "MAGNA.COMPETENCE.athletisme.label",
        defaultCarac:"agi"
    },
    bluff : {
        id: "bluff",
        label: "MAGNA.COMPETENCE.bluff.label",
        defaultCarac:"chr"
    },
    camouflage : {
        id: "camouflage",
        label: "MAGNA.COMPETENCE.camouflage.label",
        defaultCarac:"int"
    },
    clairvoyance : {
        id: "clairvoyance",
        label: "MAGNA.COMPETENCE.clairvoyance.label",
        defaultCarac:"ins"
    },
    crochetage : {
        id: "crochetage",
        label: "MAGNA.COMPETENCE.crochetage.label",
        defaultCarac:"hab"
    },
    derober : {
        id: "derober",
        label: "MAGNA.COMPETENCE.derober.label",
        defaultCarac:"hab"
    },
    discretion : {
        id: "discretion",
        label: "MAGNA.COMPETENCE.discretion.label",
        defaultCarac:"agi"
    },
    empathie : {
        id: "empathie",
        label: "MAGNA.COMPETENCE.empathie.label",
        defaultCarac:"ins"
    },
    filature : {
        id: "filature",
        label: "MAGNA.COMPETENCE.filature.label"
    },
    forcer : {
        id: "forcer",
        label: "MAGNA.COMPETENCE.forcer.label",
        defaultCarac:"vig"
    },
    fouille : {
        id: "fouille",
        label: "MAGNA.COMPETENCE.fouille.label",
        defaultCarac:"hab"
    },
    interroger : {
        id: "interroger",
        label: "MAGNA.COMPETENCE.interroger.label",
        defaultCarac:"chr"
    },
    intimider : {
        id: "intimider",
        label: "MAGNA.COMPETENCE.intimider.label",
        defaultCarac:"chr"
    },
    jeux : {
        id: "jeux",
        label: "MAGNA.COMPETENCE.jeux.label",
        defaultCarac:"ins"
    },
    memoire : {
        id: "memoire",
        label: "MAGNA.COMPETENCE.memoire.label",
        defaultCarac:"int"
    },
    observation : {
        id: "observation",
        label: "MAGNA.COMPETENCE.observation.label",
        defaultCarac:"per"
    },
    soins : {
        id: "soins",
        label: "MAGNA.COMPETENCE.soins.label",
        defaultCarac:"per"
    },
    resistance : {
        id: "resistance",
        label: "MAGNA.COMPETENCE.resistance.label",
        defaultCarac:"vig"
    },
    seduction : {
        id: "seduction",
        label: "MAGNA.COMPETENCE.seduction.label",
        defaultCarac:"chr"
    },
    selfcontrol : {
        id: "selfcontrol",
        label: "MAGNA.COMPETENCE.selfcontrol.label",
        defaultCarac:"vol"
    },
    serenseigner : {
        id: "serenseigner",
        label: "MAGNA.COMPETENCE.serenseigner.label",
        defaultCarac:"chr"
    },
    sinformer : {
        id: "sinformer",
        label: "MAGNA.COMPETENCE.sinformer.label",
        defaultCarac:"int"
    },
    survie : {
        id: "survie",
        label: "MAGNA.COMPETENCE.survie.label",
        defaultCarac:"ins"
    }
});

export const COMPETENCES_COMBAT = Object.freeze({
    mainsnues : {
        id: "mainsnues",
        label: "MAGNA.COMPETENCE_COMBAT.mainsnues.label",
        defaultCarac:"vig"
    },
    armeblanche : {
        id: "armeblanche",
        label: "MAGNA.COMPETENCE_COMBAT.armeblanche.label",
        defaultCarac:"hab"
    },
    armefeu : {
        id: "armefeu",
        label: "MAGNA.COMPETENCE_COMBAT.armefeu.label",
        defaultCarac:"hab"
    },
    armelourde : {
        id: "armelourde",
        label: "MAGNA.COMPETENCE_COMBAT.armelourde.label",
        defaultCarac:"hab"
    },
    esquive : {
        id: "esquive",
        label: "MAGNA.COMPETENCE_COMBAT.esquive.label",
        defaultCarac:"agi"
    },
    parade : {
        id: "parade",
        label: "MAGNA.COMPETENCE_COMBAT.parade.label",
        defaultCarac:"vig"
    }
});

export const COMPETENCES_SPE = Object.freeze({
    artisanats : {
        id: "artisanats",
        defaultCarac:"hab"
    },
    connaissances : {
        id: "connaissances",
        defaultCarac:"int"
    },
    langues : {
        id: "langues",
        defaultCarac:"int"
    },
    pilotage : {
        id: "pilotage",
        defaultCarac:"hab"
    },
});

export const DOMAINES = Object.freeze({
    "vie" : {
        id: "vie",
      "label" : "La Vie"
    },
    "lumiere" : {
        id: "lumiere",
      "label" : "La Lumière"
    },
    "force" :{
        id: "force",
      "label" : "La Force"
    },
    "elements" :{
        id: "elements",
      "label" : "Les Éléments"
    },
    "matiere" :{
        id: "matiere",
      "label" : "La Matière"
    },
    "memoire" :{
        id: "memoire",
      "label" : "La Mémoire"
    },
    "precognition" :{
        id: "precognition",
      "label" : "La Précognition"
    },
    "amplification" :{
        id: "amplification",
      "label" : "L’Amplification"
    },
    "magnetisme" :{
        id: "magnetisme",
      "label" : "Le Magnétisme"
    },
    "temps" :{
        id: "temps",
      "label" : "Le Temps"
    },
    "technologies" :{
        id: "technologies",
      "label" : "Les Technologies"
    },
    "technologies" :{
        id: "technologies",
      "label" : "Les Sens"
    },
    "connaissance" :{
        id: "connaissance",
      "label" : "La Connaissance"
    },
    "transformation" :{
        id: "transformation",
      "label" : "La Transformation"
    },
    "vide" :{
        id: "vide",
      "label" : "Le Vide"
    },
    "langage" :{
        id: "langage",
      "label" : "Le Langage"
    },
    "invisible" :{
        id: "invisible",
      "label" : "L’Invisible"
    },
    "sceaux" :{
        id: "sceaux",
      "label" : "Les Sceaux"
    },
   "destin" :{
    id: "destin",
      "label" : "Le Destin"
    },
    "infections" :{
        id: "infections",
      "label" : "Les Infections"
    },
    "ubiquite" :{
        id: "ubiquite",
      "label" : "L’Ubiquité"
    },
    "comunication" :{
        id: "comunication",
      "label" : "Communication"
    },
    "celerite" :{
        id: "celerite",
      "label" : "La Célérité"
    },
    "gravite" :{
        id: "gravite",
      "label" : "La Gravité"
    },
    "ombre" :{
        id: "ombre",
      "label" : "L’Ombre "
    },
    "mimetisme" :{
        id: "mimetisme",
      "label" : "Le Mimétisme"
    },
    "mort" :{
        id: "mort",
      "label" : "La Mort "
    },
    "vivant" :{
        id: "vivant",
      "label" : "Le Vivant"
    }
});

export const DIFFICULTES = Object.freeze({
    difficile : {
        id: "difficile",
        label: "MAGNA.DIFFICULTE.difficile",
        modificateur: 5
    },
    normale : {
        id: "normale",
        label: "MAGNA.DIFFICULTE.normale",
        modificateur: 0
    },
    facile : {
        id: "facile",
        label: "MAGNA.DIFFICULTE.facile",
        modificateur: -5
    }
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
  INDICES
};
