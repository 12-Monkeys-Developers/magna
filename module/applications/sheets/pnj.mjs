import MagnaActorSheet from "./actor.mjs";

/**
 * Represents a character sheet for a non player character (PNJ).
 * Extends the MagnaActorSheet class.
 */
export default class PJSheet extends MagnaActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      width: 800,
      height: 180,
    });
  }
  /**
   * The type of actor that this sheet displays.
   * @type {string}
   */
  static actorType = "pnj";

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    context.system = this.document.system;
    context.descriptionHTML = TextEditor.enrichHTML(this.actor.system.description, { async: false });
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;

    return context;
  }

  /**
   * Activates event listeners for the sheet's HTML elements.
   * @param {HTMLElement} html - The HTML element of the sheet.
   */
  activateListeners(html) {
    super.activateListeners(html);
    // Cocher Points de Vie
    html.find(".pts-vie").click(this._onCocherPv.bind(this));
  }

  /**
   * Event handler for the "Cocher Points de vie" click event.
   * @param {Event} event - The click event.
   */
  async _onCocherPv(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let indexVal = parseInt(element.dataset.index);
    if (indexVal === this.actor.system.pv.valeur) await this.actor.update({ "system.pv.valeur": indexVal - 1 });
    else await this.actor.update({ "system.pv.valeur": indexVal });
  }
}
