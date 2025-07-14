import { SYSTEM } from "../../config/system.mjs";
import { ActionDialog } from "../apps/action-dialog.mjs";

/**
 * @typedef {DiceCheckBonuses} StandardCheckData
 * @property {string} actorId                         L'ID de l'acteur a l'origine du jet
 * @property {Object} actorData                       Le contenu de system de l'acteur
 */

/**
 * The standard d20 dice pool check used by the system.
 *
 * @param {string|chatMessageData} formula  This parameter is ignored
 * @param {chatMessageData} [data]          An object of roll data, containing the following optional fields
 */
export default class ActionRoll extends foundry.dice.Roll {
  constructor(formula = "1d20", data = {}, options = {}) {
    super(formula, data, options);
    foundry.utils.mergeObject(this.options, this.constructor.DEFAULT_OPTIONS, {
      insertKeys: true,
      insertValues: true,
      overwrite: false,
    });
  }

  static DEFAULT_OPTIONS = Object.freeze({
    actorId: null,
    actorData: null,
    actingCharImg: null,
    actingCharName: null,
    itemId: null,
    armeName: "",
    degatsMentaux: 0,
    doRoll: true,
    group1: "caracteristiques",
    field1: "hab",
    valeur1: 0,
    typecomp1: null,
    part2: true,
    group2: "caracteristiques",
    field2: "hab",
    valeur2: 0,
    typecomp2: null,
    modificateur: 0,
    modificateurLab: "normale",
    opposition: 0,
    introText: "",
    finalText: "",
    lasttextsuccess: null,
    lasttext: "",
    lasttext_degatsdoubles: "",
    lasttext_degatstriples: "",
    showlasttext: false,
    seuilReussite: 0,
    reussite: false,
    result: 0,
    rollType: SYSTEM.ROLLTYPE.normal,
    rollModes: CONFIG.Dice.rollModes,
    valDuree: "",
  });

  static CHAT_TEMPLATE = "systems/magna/templates/dice/action-roll.hbs";

  async evaluate() {
    const actingChar = game.actors.get(this.options.actorId);
    if (this.options.group1 === "mental") {
      this.options.valeur1 = actingChar.system.mental.valeur;
      this.options.valeur2 = 0;
      this.options.label1 = "Mental";
      this.options.part2 = false;
      this.options.label2 = "";
      this.options.seuilReussite = actingChar.system.mental.valeur;
    } else if (this.options.group1 === "pouvoir") {
      let pouvoir = actingChar.items.get(this.options.field1);
      this.options.valeur1 = pouvoir.system.rang;
      this.options.pouvName = pouvoir.name;
      const valeurs = await actingChar.getValeurs([{ group: this.options.group2, field: this.options.field2 }]);
      this.options.valeur2 = valeurs[0];
      this.options.label1 = "Rang " + pouvoir.name;
      this.options.label2 = await actingChar.getLabelShort(this.options.group2, this.options.typecomp2, this.options.field2);
      this.options.seuilReussite = this.options.valeur1 + this.options.valeur2 + parseInt(this.options.modificateur) - this.options.opposition;
    } else {
      const valeurs = await actingChar.getValeurs([
        { group: this.options.group1, field: this.options.field1 },
        { group: this.options.group2, field: this.options.field2 },
      ]);
      this.options.valeur1 = valeurs[0];
      this.options.valeur2 = valeurs[1];
      const labels = await actingChar.getLabelsShort([
        { group: this.options.group1, field: this.options.field1 },
        { group: this.options.group2, field: this.options.field2 },
      ]);
      this.options.label1 = labels[0];
      this.options.label2 = labels[1];
      this.options.seuilReussite = valeurs[0] + valeurs[1] + parseInt(this.options.modificateur) - this.options.opposition;
    }
    if (!this.options.introText) {
      this.options.introText = game.i18n.format("MAGNA.CHATMESSAGE.introActionStd", this.options);
    }

    if (!this.options.introText.length) {
      this.options.introText = game.i18n.format("MAGNA.CHATMESSAGE.introActionStd", this.options);
    }
    await super.evaluate();
    if (this._total - this.options.seuilReussite < -9) this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.largereussite");
    else if (this._total - this.options.seuilReussite < -1) this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.reussite");
    else if (this._total - this.options.seuilReussite < 1) this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.justereussite");
    else if (this._total - this.options.seuilReussite < 3) this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.justerate");
    else if (this._total - this.options.seuilReussite < 10) this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.rate");
    else this.options.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.completementrate");
    this.options.result = this._total - this.options.seuilReussite;
    if (this.options.lasttextsuccess && this.options.result < 1) {
      this.options.showlasttext = true;
      this.options.lasttext = this.options.lasttextsuccess;
    }

    if (this.options.rollType === SYSTEM.ROLLTYPE.arme) {
      if (this.options.seuilReussite > 19) this.options.lasttext = this.options.lasttext_degatstriples;
      else if (this._total - this.options.seuilReussite < -9 && this.options.seuilReussite > 0) this.options.lasttext = this.options.lasttext_degatsdoubles;
    } else if (this.options.rollType === SYSTEM.ROLLTYPE.retracter) {
      if (this.options.result < -9) await actingChar.update({ ["system.mental.valeur"]: Math.min(actingChar.system.mental.valeur + 1, actingChar.system.mental.max) });
      else if (this.options.result > 9) await actingChar.update({ ["system.mental.valeur"]: actingChar.system.mental.valeur - this.options.degatsMentaux * 2 });
      else if (this.options.result > 0) await actingChar.update({ ["system.mental.valeur"]: actingChar.system.mental.valeur - this.options.degatsMentaux });
      await actingChar.updateEmbeddedDocuments("Item", [
        {
          _id: this.options.itemId,
          "system.auraDeployee": false,
        },
      ]);
      if (!actingChar.nbAuraDeployees) actingChar.unSetTokenAura();
    } else if (this.options.rollType === SYSTEM.ROLLTYPE.deployer) {
      if (this.options.result < 1) {
        await actingChar.updateEmbeddedDocuments("Item", [
          {
            _id: this.options.itemId,
            "system.auraDeployee": true,
          },
        ]);
        actingChar.setTokenAura();
      }
    }
    this.options.formula = this.formula;
    this.options.total = this.total;
    this.options.rolleddice = this._total;

    return this;
  }
  /** @inheritdoc */
  async render({ template = this.constructor.CHAT_TEMPLATE, isPrivate = false } = {}) {
    if (!this._evaluated) await this.evaluate({ allowInteractive: !isPrivate });
    const chatData = await this._prepareContext({ isPrivate });
    return foundry.applications.handlebars.renderTemplate(template, chatData);
  }

  /**
   * Helper function to generate render context in use with `static CHAT_TEMPLATE`
   * @param {object} options
   * @param {string} [options.flavor]     Flavor text to include
   * @param {boolean} [options.isPrivate] Is the Roll displayed privately?
   * @returns An object to be used in `renderTemplate`
   */
  async _prepareContext() {
    const context = { user: game.user.id, tooltip: await this.getTooltip() };
    await foundry.utils.mergeObject(context, this.options, {
      insertKeys: true,
      insertValues: true,
      overwrite: false,
    });
    return context;
  }
  /**
   * Prompt the user with a roll configuration dialog
   * @param {Partial<PowerRollPromptOptions>} [options] Options for the dialog
   * @return {Promise<PowerRollPrompt>} Based on evaluation made can either return an array of power rolls or chat messages
   */
  async prompt(options = {}) {
    const title = context.title ?? "Réaliser une action";

    const promptValue = await ActionDialog.prompt({
      context: this.options,
      window: {
        title: title,
      },
    });
    if (!promptValue || Object.keys(promptValue).length === 0) return null;

    foundry.utils.mergeObject(this.options, promptValue, {
      insertKeys: true,
      insertValues: true,
      overwrite: true,
    });

    return this;
  }
}
