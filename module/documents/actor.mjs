import StandardCheck from "../dice/standard-check.mjs";
export default class MagnaActor extends Actor {
  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Player character configuration
    if (this.type === "pj") {
      const prototypeToken = {
        vision: true,
        actorLink: true,
        disposition: 1, // Friendly
      };
      this.updateSource({ prototypeToken });
    }
  }
  async _onCreate(data, options, user) {
    // Player character configuration
    if (this.type === "pj") {
      //Ajoute langue maternelle
      let comparray = this.system.competences_spe.langues;
      if (!comparray.length) {
        let nouvelleCompSpe = {
          label: "Maternelle",
          defaultCarac: "int",
          valeur: 4,
        };
        comparray.push(nouvelleCompSpe);
        await this.update({ [`system.competences_spe.langues`]: comparray });
      }
      //vitalité et mental au max
      this.system.vitalite.valeur = this.vitalite_max;
      this.system.mental.valeur = this.mental_max;

      return await super._onCreate(data, options, user);
    }
  }

  get isUnlocked() {
    if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
    return false;
  }

  get auraDeployee() {
    if (this.getFlag(game.system.id, "AuraDeployee")) return true;
    return false;
  }

  /**
   * Retourne les indices d'un PJ
   */
  get cac() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.vig.valeur + this.system.caracteristiques.agi.valeur;
  }
  get dist() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.ins.valeur + this.system.caracteristiques.per.valeur;
  }
  get ref() {
    if (this.type !== "pj") return undefined;
    return Math.max(this.system.caracteristiques.ins.valeur + this.system.caracteristiques.agi.valeur - 10, 0);
  }
  get cacpsi() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.vig.valeur + this.system.caracteristiques.agi.valeur + this.system.caracteristiques.psi.valeur;
  }
  get distpsi() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.ins.valeur + this.system.caracteristiques.per.valeur + this.system.caracteristiques.psi.valeur;
  }
  get refpsi() {
    if (this.type !== "pj") return undefined;
    return Math.max(this.system.caracteristiques.ins.valeur + this.system.caracteristiques.agi.valeur - 10, 0) + this.system.caracteristiques.psi.valeur;
  }
  get vitalite_max() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.vig.valeur + 10;
  }
  get mental_max() {
    if (this.type !== "pj") return undefined;
    return this.system.caracteristiques.vol.valeur + this.system.caracteristiques.psi.valeur;
  }
  get listeVoies() {
    const pouvoirs = this.items.filter((item) => item.type == "pouvoir");
    let liste = [];
    pouvoirs.forEach((element) => {
      if (liste.indexOf(element.system.voie) === -1) {
        liste.push(element.system.voie);
      }
    });
    console.log("liste", liste);
    return(liste);
  }

  async ajouterCompSpe(compType) {
    let comparray = this.system.competences_spe[compType];
    let nouvelleCompSpe = {
      label: game.i18n.localize("MAGNA.NOUVEAU." + compType),
      defaultCarac: SYSTEM.COMPETENCES_SPE[compType].defaultCarac,
      valeur: 0,
    };
    comparray.push(nouvelleCompSpe);
    return this.update({ [`system.competences_spe.${compType}`]: comparray });
  }

  async modifierCompSpe(compType, compIndex, compField, newValue) {
    let comparray = this.system.competences_spe[compType];
    let compSpe = comparray[compIndex];
    compSpe[compField] = newValue;
    comparray[compIndex] = compSpe;
    return this.update({ [`system.competences_spe.${compType}`]: comparray });
  }

  async lectureCompSpe(compType, compIndex) {
    const comparray = this.system.competences_spe[compType];
    return comparray[compIndex];
  }

  async supprimerCompSpe(compType, compIndex) {
    let comparray = this.system.competences_spe[compType];
    let suppr = comparray.splice(compIndex, 1);
    return this.update({ [`system.competences_spe.${compType}`]: comparray });
  }

  /**
   * Action roll
   * @param {string} group - Le groupe parmi: competences, combat, competences_spe.artisanats ,competences_spe.connaissances, competences_spe.langues, competences_spe.,competences_spe.,
   * @param {string} moyen - The means of the action.
   * @returns {Promise<StandardCheck>} - A promise that resolves to the rolled check.
   */
  async rollAction(compData) {
    //{group1: group, field1:field, askDialog:true});
    // Prepare check data
    compData.actorId = this.id;
    compData.actorData = this.system;

    // Create the check roll
    let sc = new StandardCheck(compData);

    if (compData.askDialog) {
      // Prompt the user with a roll dialog
      const flavor = "Réaliser une action";
      const title = "Réaliser une action";
      const response = await sc.dialog({ title, flavor });
      if (response === null) return null;
    }

    sc = await sc.roll();
    // Execute the roll to chat
    await sc.toMessage();
    return sc;
  }
}
