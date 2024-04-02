import MagnaItemSheet from "./item.mjs";

export default class ArmeSheet extends MagnaItemSheet {
  /**
   * Le type d'Item qu'affiche cette Sheet
   * @type {string}
   */
  static itemType = "arme";
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      height: 400,
      width: 400,
      classes: [SYSTEM.id, "sheet", "item", this.itemType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.itemType}.hbs`,
      resizable: true,
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    context.competencescombat = SYSTEM.COMPETENCES_COMBAT;
    context.descriptionhtml = await TextEditor.enrichHTML(this.item.system.description, { async: false });
    return context;
  }
}