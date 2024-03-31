import MagnaActorSheet from "./actor.mjs";

/**
 * Represents a character sheet for a player character (PJ).
 * Extends the MagnaActorSheet class.
 */
export default class PJSheet extends MagnaActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      width: 700,
      height: 900,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "competences" }],
    });
  }

  /**
   * The type of actor that this sheet displays.
   * @type {string}
   */
  static actorType = "pj";

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    context.system = this.document.system;
    context.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description, { async: false });
    context.equipementHTML = await TextEditor.enrichHTML(this.actor.system.equipement, { async: false });
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;
    context.nbAuraDeployees = this.actor.nbAuraDeployees;
    context.indices = {
      cac: {
        valeur: this.actor.cac,
        label_short: "MAGNA.INDICE.cac.label_short",
        label: "MAGNA.INDICE.cac.label",
      },
      dist: {
        valeur: this.actor.dist,
        label_short: "MAGNA.INDICE.dist.label_short",
        label: "MAGNA.INDICE.dist.label",
      },
      ref: {
        valeur: this.actor.ref,
        label_short: "MAGNA.INDICE.ref.label_short",
        label: "MAGNA.INDICE.ref.label",
      },
      cacpsi: {
        valeur: this.actor.cacpsi,
        label_short: "MAGNA.INDICE.cacpsi.label_short",
        label: "MAGNA.INDICE.cacpsi.label",
      },
      distpsi: {
        valeur: this.actor.distpsi,
        label_short: "MAGNA.INDICE.distpsi.label_short",
        label: "MAGNA.INDICE.distpsi.label",
      },
      refpsi: {
        valeur: this.actor.refpsi,
        label_short: "MAGNA.INDICE.refpsi.label_short",
        label: "MAGNA.INDICE.refpsi.label",
      },
    };
    context.vitalite_max = this.actor.vitalite_max;
    context.mental_max = this.actor.mental_max;

    // Pouvoirs par ordre niveau et mise en forme de la description

    context.listevoies = this.actor.listeVoies;

    context.armes = this.actor.items
      .filter((item) => item.type == "arme")
      .sort(function (a, b) {
        return a.name > b.name;
      });
      context.armes.forEach(async (element) => {
        element.system.degatsmodifies = await this.actor.degatsmodifies(element._id);
      });
    context.pouvoirs = this.actor.items
      .filter((item) => item.type == "pouvoir")
      .sort(function (a, b) {
        return a.system.rang > b.system.rang;
      });
    context.pouvoirs.forEach(async (element) => {
      element.system.descriptionhtml = await TextEditor.enrichHTML(element.system.description, { async: false });
    });
    return context;
  }

  /**
   * Activates event listeners for the sheet's HTML elements.
   * @param {HTMLElement} html - The HTML element of the sheet.
   */
  activateListeners(html) {
    super.activateListeners(html);
    // Ajouter une compétence spécialisée
    html.find(".new-comp").click(this._onNewComp.bind(this));
    // Jet d'action
    html.find(".roll-carac").click(this._onJetAction.bind(this));
    html.find(".compspe-edit").change(this._onCompSpeEdit.bind(this));
    html.find(".compspe-delete").click(this._onCompSpeDelete.bind(this));
  }

  /**
   * Event handler for the "Jet d'action" click event.
   * @param {Event} event - The click event.
   */
  async _onJetAction(event) {
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    let group = dataset.group;
    let data = {
      group1: group,
      typecomp1: dataset.type,
      field1: dataset.field,
      group2: "caracteristiques",
      field2: "hab",
      askDialog: true,
    };
    if (group === "competences") {
      data.field2 = SYSTEM.COMPETENCES[data.field1].defaultCarac;
    } else if (group === "combat") {
      data.field2 = SYSTEM.COMPETENCES_COMBAT[data.field1].defaultCarac;
    } else if (group === "competences_spe") {
      const compSpe = await this.actor.lectureCompSpe(dataset.type, dataset.field);
      data.field1 = compSpe;
      data.field2 = compSpe.defaultCarac;
    } else if (group === "mental") {
      data.askDialog = false;
      data.field1 = "mental";
    } else if (group === "pouvoir") {
      data.group2 = "indices";
      data.field2 = "distpsi";
    }
    return this.actor.rollAction(data);
  }

  /**
   * Event handler for the new comp click event.
   * @param {Event} event - The click event.
   */
  async _onNewComp(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compType = element.dataset.field;
    this.actor.ajouterCompSpe(compType);
  }
  async _onCompSpeEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compIndex = parseInt(element.dataset.id);
    let compType = element.dataset.type;
    let compField = element.dataset.field;
    let newValue = element.valueAsNumber ? element.valueAsNumber : element.value;
    this.actor.modifierCompSpe(compType, compIndex, compField, newValue);
  }
  async _onCompSpeDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compIndex = parseInt(element.dataset.id);
    let compType = element.dataset.type;
    this.actor.supprimerCompSpe(compType, compIndex);
  }
}
