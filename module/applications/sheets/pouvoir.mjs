import MagnaItemSheet from "./item.mjs";

export default class PouvoirSheet extends MagnaItemSheet {
  /**
   * Le type d'Item qu'affiche cette Sheet
   * @type {string}
   */
  static itemType = "pouvoir";
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      height: 390,
      width: 450,
      classes: [SYSTEM.id, "sheet", "item", this.itemType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.itemType}.hbs`,
      resizable: true,
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    context.domaines = SYSTEM.DOMAINES;
    context.descriptionhtml = await TextEditor.enrichHTML(this.item.system.description, { async: false });
    return context;
  }
}