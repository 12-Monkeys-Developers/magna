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
      //      this.updateSource({ prototypeToken });
      this.updateSource({
        "prototypeToken.vision": true,
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": 1, // Friendly
      });
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

  /** @override */
  async prepareBaseData() {
    await super.prepareBaseData();
    this.system.vitalite.max = this.system.caracteristiques.vig.valeur + 10;
    this.system.mental.max = this.system.caracteristiques.vol.valeur + this.system.caracteristiques.psi.valeur;
    this.system.vitalite.value = this.system.vitalite.valeur;
    this.system.mental.value = this.system.mental.valeur;
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
    compData.doRoll = true;

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
      await this.updateEmbeddedDocuments("Item", [
        {
          _id: pouvoir.id,
          "system.auraDeployee": true,
        },
      ]);
      this.setTokenAura();
      if (!forceFree) this.update({ ["system.mental.valeur"]: this.system.mental.valeur - 3 });
      const introText = game.i18n.format("MAGNA.CHATMESSAGE.introForcerAura", { actingCharName: this.name });
      const finalText = game.i18n.format("MAGNA.CHATMESSAGE.textForceraura", { actingCharName: this.name, nompouvoir: pouvoir.name });

      return await this.chatMessage(introText, finalText, false);
    }
    let lasttextsuccess = game.i18n.format("MAGNA.CHATMESSAGE.textdeployeraura", { nompouvoir: pouvoir.name });
    const introText = game.i18n.format("MAGNA.CHATMESSAGE.introDeployerAura", { actingCharName: this.name });
    let data = {
      group1: "caracteristiques",
      typecomp1: false,
      field1: "psi",
      group2: "caracteristiques",
      field2: "psi",
      introText: introText,
      lasttextsuccess: lasttextsuccess,
    };
    let sc = await this.rollAction(data);
    if (sc._total - sc.data.seuilReussite < 1) {
      await this.updateEmbeddedDocuments("Item", [
        {
          _id: pouvoir.id,
          "system.auraDeployee": true,
        },
      ]);
      this.setTokenAura();
      return true;
    } else return false;
  }
  /**
   * Rétracter
   * @param {string} id - L'id du pouvoir
   */
  async retracterAura(itemId) {
    let pouvoir = this.items.get(itemId);
    if (!pouvoir) return;

    const dialog_content = await renderTemplate(`systems/${SYSTEM.id}/templates/sheets/contrecoup-dialog.hbs`, { contrecoups: SYSTEM.CONTRECOUPS });
    let dialog = new Dialog({
      title: "Contrecoup",
      content: dialog_content,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-face-head-bandage"></i>',
          label: `Ok`,
          callback: async (html) => {
            const valDuree = html.find("[name=contrecoup]")[0].value;
            const pouvoirs = this.items.filter((item) => item.type == "pouvoir");
            let degatsMentaux = SYSTEM.CONTRECOUPS[valDuree].couppouv3;
            if (pouvoirs.length < 6) degatsMentaux = SYSTEM.CONTRECOUPS[valDuree].couppouv1;
            else if (pouvoirs.length < 11) degatsMentaux = SYSTEM.CONTRECOUPS[valDuree].couppouv2;

            const introText = game.i18n.format("MAGNA.CHATMESSAGE.introRetracterAura", { actingCharName: this.name });
            const lasttext = game.i18n.format("MAGNA.CHATMESSAGE.textRetracteraura", { actingCharName: this.name, nompouvoir: pouvoir.name });

            let data = {
              group1: "mental",
              typecomp1: false,
              field1: "mental",
              group2: "mental",
              field2: "mental",
              askDialog: false,
              introText: introText,
              lasttext: lasttext,
              degatsMentaux: degatsMentaux,
              retracte: itemId,
              showlasttext: true,
              valDuree: SYSTEM.CONTRECOUPS[valDuree].label,
            };
            return this.rollAction(data);
          },
        },
        cancel: {
          label: `Pas de Contrecoup`,
          callback: async (html) => {
            await this.updateEmbeddedDocuments("Item", [
              {
                _id: pouvoir.id,
                "system.auraDeployee": false,
              },
            ]);
            if (!this.nbAuraDeployees) this.unSetTokenAura();
          },
        },
      },
      default: "confirm",
    });
    dialog.render(true);
  }

  /*Affiche le portrait du personnage aux joueurs et joueuses connectés*/
  async showPortrait(options = {}) {
    let htmlTemplate = `
    <h3>Portrait</h3>`;
    new Dialog({
      title: "Portrait",
      content: htmlTemplate,
      buttons: {
        validate: {
          label: "Afficher le portrait de " + this.name + " à tous les joueurs et joueuses connectés.",
          callback: () => {
            let print = new ImagePopout(this.img, {
              title: this.name,
              shareable: true,
              uuid: this.uuid,
            }).render(true);
            print.shareImage();
          },
        },
        close: {
          label: "annuler",
        },
      },
    }).render(true);
  }

  async rollInit(options = {}) {
    // Produce an initiative roll for the Combatant
    const roll = new Roll("1d20 + @agi", { agi: this.system.caracteristiques.agi.valeur });
    await roll.evaluate();
    let rangaction = Math.floor(roll._total / 5);
    // Visibilité des jet des PNJs
    if (this.type === "pnj" && game.user.isGM) {
      options.rollMode = "gmroll";
    }

    // Construct chat message data
    let messageData = foundry.utils.mergeObject(
      {
        speaker: ChatMessage.getSpeaker({
          actor: this,
          token: this.token,
          alias: this.name,
        }),
        flavor: game.i18n.format("MAGNA.COMBAT.initiative", { name: this.name, rangaction: rangaction }),
      },
      options
    );
    const chatData = await roll.toMessage(messageData);
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
    const armeName = arme.name;
    const degats = await this.degatsmodifies(itemId);
    let lasttext = game.i18n.format("MAGNA.CHATMESSAGE.textdegats", { degats: degats });
    let lasttext_degatsdoubles = game.i18n.format("MAGNA.CHATMESSAGE.textdegats_doubles", { degats: degats * 2 });
    let lasttext_degatstriples = game.i18n.format("MAGNA.CHATMESSAGE.textdegats_triples", { degats: degats * 3 });

    let introText = game.i18n.format("MAGNA.CHATMESSAGE.introArmeStd", { actingCharName: this.name, armeName: armeName });
    let data = {
      group1: "combat",
      typecomp1: false,
      field1: arme.system.competence,
      group2: "indices",
      field2: SYSTEM.COMPETENCES_COMBAT[arme.system.competence].defaultIndice,
      askDialog: true,
      armeId: itemId,
      armeName: armeName,
      introText: introText,
      lasttextsuccess: lasttext,
      lasttext_degatsdoubles: lasttext_degatsdoubles,
      lasttext_degatstriples: lasttext_degatstriples,
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
    const maxValue = this.system[data].max;
    return await this.update({ [`system.${data}.valeur`]: maxValue });
  }

  /**
   * Calcul du nombre de Pex dépensés
   */
  async pextotal() {
    async function pexvalue(value) {
      return Math.min(3, value) + Math.min(3, Math.max(value - 3, 0)) * 2 + Math.min(1, Math.max(value - 6, 0)) * 3 + Math.min(1, Math.max(value - 7, 0)) * 4;
    }

    let excludePsi = game.settings.get("magna", "excludePsi");
    let pexTotal = 0;
    //let pexTotal = -690;

    //caracteristiques
    for (const element in this.system.caracteristiques) {
      if (element != "psi" || !excludePsi) {
        pexTotal += this.system.caracteristiques[element].max * 15;
      }
    }
    //competences
    for (const element in this.system.competences) {
      pexTotal += await pexvalue(this.system.competences[element].valeur);
    }
    //competences de combat
    for (const element in this.system.combat) {
      pexTotal += await pexvalue(this.system.combat[element].valeur);
    }
    //competences spe
    for (const compType in SYSTEM.COMPETENCES_SPE) {
      let comparray = this.system.competences_spe[compType];
      for (const element of comparray) {
        pexTotal += await pexvalue(element.valeur);
      }
    }
    pexTotal += this.items.filter((item) => item.type == "pouvoir").length * 10;

    return pexTotal;
  }

  async chatMessage(introText, finalText, retracte, flags) {
    const data = {
      data: {
        actorId: this.id,
        actingCharImg: this.img,
        actingCharName: this.name,
        doRoll: false,
        finalText: finalText,
        introText: introText,
        retracte: retracte,
      },
    };
    // Create the chat content
    let content = await renderTemplate("systems/magna/templates/dice/standard-check-roll.hbs", data);

    // Create the chat data
    const chatData = foundry.utils.duplicate(data);
    chatData.user = game.user.id;
    chatData.content = content;
    chatData.flags = flags;

    /* -------------------------------------------- */
    // Visibilité des jet des PNJs
    if (this.type === "pnj" && game.user.isGM) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    }

    return await ChatMessage.create(chatData);
  }

  async setTokenAura() {
    for (const scene of game.scenes) {
      let updates = [];
      for (const token of scene.tokens) {
        if (token.actorId === this._id) {
          updates.push({
            _id: token.id,
            light: SYSTEM.PSIAURA_LIGHTING,
          });
        }
      }
      scene.updateEmbeddedDocuments("Token", updates);
    }
    return await this.update({
      [`prototypeToken.light`]: SYSTEM.PSIAURA_LIGHTING,
    });
  }

  async unSetTokenAura() {
    for (const scene of game.scenes) {
      let updates = [];
      for (const token of scene.tokens) {
        if (token.actorId === this._id) {
          updates.push({
            _id: token.id,
            light: SYSTEM.NOAURA_LIGHTING,
          });
        }
      }
      scene.updateEmbeddedDocuments("Token", updates);
    }
    return await this.update({
      [`prototypeToken.light`]: SYSTEM.NOAURA_LIGHTING,
    });
  }
}

/**
 * Prompt the user to perform a search.
 * @extends {Dialog}
 */
export class ContrecoupDialog extends Dialog {
  /** @override */
}
