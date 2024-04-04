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

      return await super._onCreate(data, options, user);
    }
  }

  get isUnlocked() {
    if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
    return false;
  }

  get sheetlight() {
    if (this.getFlag(game.system.id, "sheetlight")) return true;
    return false;
  }

  get nbAuraDeployees() {
    let auraDeployee = 0;
    const pouvoirs = this.items.filter((item) => item.type == "pouvoir");
    pouvoirs.forEach(async (element) => {
      if (element.system.auraDeployee) auraDeployee += 1;
    });
    return auraDeployee;
  }

  /**
   * Retourne les indices d'un PJ
   */
  get cac() {
    return this.system.caracteristiques.vig.valeur + this.system.caracteristiques.agi.valeur;
  }
  get dist() {
    return this.system.caracteristiques.ins.valeur + this.system.caracteristiques.per.valeur;
  }
  get ref() {
    return Math.max(this.system.caracteristiques.ins.valeur + this.system.caracteristiques.agi.valeur - 10, 0);
  }
  get cacpsi() {
    return this.system.caracteristiques.vig.valeur + this.system.caracteristiques.agi.valeur + this.system.caracteristiques.psi.valeur;
  }
  get distpsi() {
    return this.system.caracteristiques.ins.valeur + this.system.caracteristiques.per.valeur + this.system.caracteristiques.psi.valeur;
  }
  get refpsi() {
    return Math.max(this.system.caracteristiques.ins.valeur + this.system.caracteristiques.agi.valeur - 10, 0) + this.system.caracteristiques.psi.valeur;
  }
  get vitalite_max() {
    return this.system.caracteristiques.vig.valeur + 10;
  }
  get mental_max() {
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
    return liste;
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
      const flavor = compData.flavor ?? "Réaliser une action";
      const title = compData.title ?? "Réaliser une action";
      const response = await sc.dialog({ title, flavor });
      if (response === null) return null;
    }

    sc = await sc.roll();
    // Execute the roll to chat
    await sc.toMessage();
    return sc;
  }

  /**
   * Déployer une aura
   * @param {string} id - L'id du pouvoir dont l'aura tente dêtre déployée
   * @param {boolean} force - forcer le déploiement
   * @param {boolean} forceFree - forcer le déploiement sans dépense de Mental
   * @returns {Promise<StandardCheck>} - A promise that resolves to the rolled check.
   */

  async deployerAura(itemId, force = false, forceFree = false) {
    let pouvoir = this.items.get(itemId);
    if (!pouvoir) return;
    if (force) {
      pouvoir.update({ ["system.auraDeployee"]: true });
      if (!forceFree) this.update({ ["system.mental.valeur"]: this.system.mental.valeur - 3 });
      return true;
    }
    let data = {
      group1: "caracteristiques",
      typecomp1: false,
      field1: "psi",
      group2: "caracteristiques",
      field2: "psi",
    };
    let sc = await this.rollAction(data);
    if (sc._total - sc.data.seuilReussite < 1) {
      pouvoir.update({ ["system.auraDeployee"]: true });
      return true;
    } else return false;
  }

  /**
   * Rétracter
   * @param {string} id - L'id du pouvoir
   * @returns {Promise<StandardCheck>} - A promise that resolves to the rolled check.
   */
  async retracterAura(itemId) {
    let pouvoir = this.items.get(itemId);
    if (!pouvoir) return;
    pouvoir.update({ ["system.auraDeployee"]: false });
    return true;
  }
  async rollInit() {
    let r = new Roll("1d20 + @agi", { agi: this.system.caracteristiques.agi.valeur });
    let options = { rollMode: "gmroll", user: game.user._id };
    if (this.type === "pj") options.rollMode = r.toMessage({ speaker: ChatMessage.implementation.getSpeaker({ actor: this }), flavor: "Initiative de " + this.name });
  }

  /**
   * Calcul des dégats modifés par la compétence
   * @param {string} id - L'id de l'arme
   * @returns {number} les dégats.
   */
  async degatsmodifies(armeId) {
    let arme = this.items.get(armeId);
    if (!arme) return;
    let competence = arme.system.competence;
    let comvalue = this.system.combat[competence].valeur;
    if (comvalue > 6) return arme.system.degats + 2;
    else if (comvalue > 3) return arme.system.degats + 1;
    else return arme.system.degats;
  }

  async utiliserArme(itemId) {
    const arme = this.items.get(itemId);
    if (!arme) return;
    const armeName=arme.name;
    const degats= await this.degatsmodifies(itemId);
    let data = {
      group1: "combat",
      typecomp1: false,
      field1: arme.system.competence,
      group2: "indices",
      field2: SYSTEM.COMPETENCES_COMBAT[arme.system.competence].defaultIndice,
      askDialog: true,
      armeId: itemId,
      armeName: armeName,
      degats: degats,
    };
    return this.rollAction(data);
  }

  async getValeurs(data) {
    let returnValeurs = [];
    data.forEach(async (element) => {
      if (element.group === "competences_spe") {
        returnValeurs.push(element.field.valeur);
      } else if (element.group === "indices") {
        returnValeurs.push(this[element.field]);
      } else {
        returnValeurs.push(this.system[element.group][element.field].valeur);
      }
    });
    return returnValeurs;
  }

  async getLabelShort(group, typecomp, field) {
    let label = "";
    if (group === "competences_spe") {
      label = field.label;
    } else if (group === "caracteristiques") {
      label = game.i18n.localize(SYSTEM.CARACTERISTIQUES[field].label_short);
    } else if (group === "indices") {
      label = game.i18n.localize(SYSTEM.INDICES[field].label_short);
    } else {
      label = game.i18n.localize(this.system[group][field].label);
    }
    return label;
  }
  async getLabelsShort(data) {
    let returnLabels = [];
    data.forEach(async (element) => {
      if (element.group === "competences_spe") {
        returnLabels.push(element.field.label);
      } else if (element.group === "caracteristiques") {
        returnLabels.push(game.i18n.localize(SYSTEM.CARACTERISTIQUES[element.field].label_short));
      } else if (element.group === "indices") {
        returnLabels.push(game.i18n.localize(SYSTEM.INDICES[element.field].label_short));
      } else {
        returnLabels.push(game.i18n.localize(this.system[element.group][element.field].label));
      }
    });
    return returnLabels;
  }

  /**
   * mettre au maximum
   * @param {string} caract caracteristique à maximiser
   */
  async setCaracToMax(caract) {
    return await this.update({ [`system.caracteristiques.${caract}.valeur`]: this.system.caracteristiques[caract].max });
  }

  /**
   * mettre au maximum
   * @param {string} data - mental ou vitalite
   */
  async setToMax(data) {
    const maxValue = this[data + "_max"];
    return await this.update({ [`system.${data}.valeur`]: maxValue });
  }
}
