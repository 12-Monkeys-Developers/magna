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
      height: 490,
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
    context.car_ind_merge = SYSTEM.CAR_IND_MERGE;
    context.descriptionhtml = await TextEditor.enrichHTML(this.item.system.description, { async: false });
    context.aff_domaines = game.user.isGM || game.settings.get("magna", "aff_domaines");
    context.selectRang_min = {
      0: "0",
      2: "2",
      4: "4",
      6: "6",
    };
    
    return context;
  }
}