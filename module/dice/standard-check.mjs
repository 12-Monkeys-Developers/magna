import { SYSTEM } from "../config/system.mjs";
import StandardCheckDialog from "./standard-check-dialog.mjs";

/**
 * @typedef {DiceCheckBonuses} StandardCheckData
 * @property {string} actorId                         L'ID de l'acteur a l'origine du jet
 * @property {Object} actorData                       Le contenu de system de l'acteur
 */

/**
 * The standard (qualite)d6 dice pool check used by the system.
 *
 * @param {string|StandardCheckData} formula  This parameter is ignored
 * @param {StandardCheckData} [data]          An object of roll data, containing the following optional fields
 */
export default class StandardCheck extends Roll {
  constructor(formula, data) {
    if (typeof formula === "object") {
      data = formula;
      formula = "";
    }
    super(formula, data);
  }

  /**
   * Define the default data attributes for this type of Roll
   * @type {object}
   */
  static defaultData = {
    actorId: null,
    actorData: null,
    actingCharImg: null,
    actingCharName: null,
    armeId: null,
    armeName: "",
    degatsMentaux: 0,
    diceformula: "1d20",
    doRoll: true,
    introText: "",
    finalText: "",
    lasttextsuccess: null,
    lasttext: "",
    lasttext_degatsdoubles: "",
    lasttext_degatstriples: "",
    showlasttext: false,
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
    seuilReussite: 0,
    reussite: false,
    result: 0,
    retracte: false,
    rollMode: "publicroll",
    valDuree: "",
  };

  /**
   * Which Dialog subclass should display a prompt for this Roll type?
   * @type {StandardCheckDialog}
   */
  static dialogClass = StandardCheckDialog;

  /**
   * The HTML template path used to render dice checks of this type
   * @type {string}
   */
  static htmlTemplate = "systems/magna/templates/dice/standard-check-roll.hbs";

  /* -------------------------------------------- */
  /*  Roll Configuration                          */
  /* -------------------------------------------- */

  /** @override */
  _prepareData(data = {}) {
    //console.log("_prepareData : ",this);
    const current = this.data || foundry.utils.deepClone(this.constructor.defaultData);
    for (let [k, v] of Object.entries(data)) {
      if (v === undefined) delete data[k];
    }
    data = foundry.utils.mergeObject(current, data, { insertKeys: false });
    StandardCheck.#configureData(data);
    return data;
  }

  /**
   * Configure the provided data used to customize this type of Roll
   * @param {object} data     The initially provided data object
   * @returns {object}        The configured data object
   */
  static async #configureData(data) {
    //console.log("configureData : ",this);
    const actingChar = game.actors.get(data.actorId);

    if (data.group1 === "mental") {
      data.valeur1 = actingChar.system.mental.valeur;
      data.valeur2 = 0;
      data.label1 = "Mental";
      data.part2 = false;
      data.label2 = "";
      data.seuilReussite = actingChar.system.mental.valeur;
    } else if (data.group1 === "pouvoir") {
      let pouvoir = actingChar.items.get(data.field1);
      data.valeur1 = pouvoir.system.rang;
      data.pouvName = pouvoir.name;
      const valeurs = await actingChar.getValeurs([{ group: data.group2, field: data.field2 }]);
      data.valeur2 = valeurs[0];
      data.label1 = "Rang " + pouvoir.name;
      data.label2 = await actingChar.getLabelShort(data.group2, data.typecomp2, data.field2);
      data.seuilReussite = data.valeur1 + data.valeur2 + parseInt(data.modificateur) - data.opposition;
    } else {
      const valeurs = await actingChar.getValeurs([
        { group: data.group1, field: data.field1 },
        { group: data.group2, field: data.field2 },
      ]);
      data.valeur1 = valeurs[0];
      data.valeur2 = valeurs[1];
      const labels = await actingChar.getLabelsShort([
        { group: data.group1, field: data.field1 },
        { group: data.group2, field: data.field2 },
      ]);
      data.label1 = labels[0];
      data.label2 = labels[1];
      data.seuilReussite = valeurs[0] + valeurs[1] + parseInt(data.modificateur) - data.opposition;
    }
    data.actingCharImg = actingChar.img;
    data.actingCharName = actingChar.name;
    if (!data.introText) {
      data.introText = game.i18n.format("MAGNA.CHATMESSAGE.introActionStd", data);
    }
  }
  /** @override */
  static parse(_, data) {
    // Construct the formula

    let formula = "1d20";
    data.diceformula = formula;
    return super.parse(formula, data);
  }

  async render(chatOptions = {}) {
    if (chatOptions.isPrivate) return "";
    return renderTemplate(this.constructor.htmlTemplate, this._getChatCardData());
  }

  /**
   * Prepare the data object used to render the StandardCheck object to an HTML template
   * @returns {object}      A prepared context object that is used to render the HTML template
   * @private
   */
  _getChatCardData() {
    const cardData = {
      css: [SYSTEM.id, "standard-check"],
      data: this.data,
      isGM: game.user.isGM,
      formula: this.formula,
      total: this.total,
      rolleddice: this._total,
    };

    cardData.cssClass = cardData.css.join(" ");
    return cardData;
  }

  /**
   * Used to re-initialize the pool with different data
   * @param {object} data
   */
  initialize(data) {
    this.data = this._prepareData(data);
    this.terms = this.constructor.parse("", this.data);
    //console.log("initialize : ",this);
  }

  /**
   * Present a Dialog instance for this pool
   * @param {string} title      The title of the roll request
   * @param {string} flavor     Any flavor text attached to the roll
   * @param {string} rollMode   The requested roll mode
   * @returns {Promise<StandardCheck|null>}   The resolved check, or null if the dialog was closed
   */
  async dialog({ title, flavor, rollMode } = {}) {
    const options = { title, flavor, rollMode, roll: this };
    return this.constructor.dialogClass.prompt({ title, options });
  }

  /** @inheritdoc */
  toJSON() {
    const data = super.toJSON();
    data.data = foundry.utils.deepClone(this.data);
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async toMessage(messageData, options = {}) {
    const actingChar = game.actors.get(this.data.actorId);

    // par defaut la visibilité est indiquée par le chat
    options.rollMode = game.settings.get("core", "rollMode");
    /* -------------------------------------------- */
    // Visibilité des jet des PNJs
    if (actingChar.type === "pnj" && game.user.isGM) {
      options.rollMode = "gmroll";
    }
    return super.toMessage(messageData, options);
  }

  /** @override */
  async evaluate(allowInteractive) {
    await super.evaluate(allowInteractive);
    if (this._total - this.data.seuilReussite < -9) this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.largereussite");
    else if (this._total - this.data.seuilReussite < -1) this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.reussite");
    else if (this._total - this.data.seuilReussite < 1) this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.justereussite");
    else if (this._total - this.data.seuilReussite < 3) this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.justerate");
    else if (this._total - this.data.seuilReussite < 10) this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.rate");
    else this.data.finalText = game.i18n.localize("MAGNA.CHATMESSAGE.completementrate");
    this.data.result = this._total - this.data.seuilReussite;
    if (this.data.lasttextsuccess && this.data.result < 1) {
      this.data.showlasttext = true;
      this.data.lasttext = this.data.lasttextsuccess;
    }

    if (this.data.armeId && this.data.seuilReussite > 19) this.data.lasttext = this.data.lasttext_degatstriples;
    else if (this.data.armeId && this._total - this.data.seuilReussite < -9 && this.data.seuilReussite > 0) this.data.lasttext = this.data.lasttext_degatsdoubles;

    //cas retraction aura
    if (this.data.retracte) {
      let actor = game.actors.get(this.data.actorId);
      let pouvoir = actor.items.get(this.data.retracte);
      if (this.data.result < -9) await actor.update({ ["system.mental.valeur"]: Math.min(actor.system.mental.valeur + 1, actor.system.mental.max) });
      else if (this.data.result > 9) await actor.update({ ["system.mental.valeur"]: actor.system.mental.valeur - this.data.degatsMentaux * 2 });
      else if (this.data.result > 0) await actor.update({ ["system.mental.valeur"]: actor.system.mental.valeur - this.data.degatsMentaux });
      await actor.updateEmbeddedDocuments("Item", [
        {
          _id: pouvoir.id,
          "system.auraDeployee": false,
        },
      ]);
      if (!actor.nbAuraDeployees) actor.unSetTokenAura();
    }
    return this;
  }
}
