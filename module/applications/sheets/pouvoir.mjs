import MagnaItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";
const { api, sheets } = foundry.applications;

export default class PouvoirSheet extends MagnaItemSheet {
  static DEFAULT_OPTIONS = {
    id: "pouvoir",
    classes: ["pouvoir-sheet"],
    position: {
      height: 490,
      width: 450,
    },
    window: {
      title: "pouvoirSheet.form.title",
    },
  };

  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
    },
    pouvoir: {
      template: `systems/${SYSTEM.id}/templates/sheets/pouvoir.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
    },
  };
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.aff_domaines = game.user.isGM || game.settings.get("magna", "aff_domaines");
    return context;
  }
}