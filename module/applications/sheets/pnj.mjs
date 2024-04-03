import MagnaActorSheet from "./actor.mjs";

/**
 * Represents a character sheet for a non player character (PNJ).
 * Extends the MagnaActorSheet class.
 */
export default class PNJSheet extends MagnaActorSheet {
  /**
   * The type of actor that this sheet displays.
   * @type {string}
   */
  static actorType = "pnj";

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    return context;
  }

  /**
   * Activates event listeners for the sheet's HTML elements.
   * @param {HTMLElement} html - The HTML element of the sheet.
   */
  activateListeners(html) {
    super.activateListeners(html);
    // Passer en fiche light / complete
    html.find(".change-aspect").click(this._onSheetChangeAspect.bind(this));
  }


  /**
   * Manage the sheetlight button on the sheet
   *
   * @name _onSheetChangelock
   * @param {*} event
   */
  async _onSheetChangeAspect(event) {
    event.preventDefault();

    let flagData = await this.actor.getFlag(game.system.id, "sheetlight");
    if (flagData) await this.actor.unsetFlag(game.system.id, "sheetlight");
    else await this.actor.setFlag(game.system.id, "sheetlight", "sheetlight");
    this.actor.sheet.render(true);
  }
}
