import MagnaItemSheet from "./item.mjs";
import { SYSTEM } from "../../config/system.mjs";
const { api, sheets } = foundry.applications;

export default class ArmeSheet extends MagnaItemSheet {
  static DEFAULT_OPTIONS = {
    id: "arme",
    classes: ["arme-sheet"],
    position: {
      height: 400,
      width: 450,
    },
    window: {
      title: "ArmeSheet.form.title",
    },
  };

  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-header.hbs`,
    },
    arme: {
      template: `systems/${SYSTEM.id}/templates/sheets/arme.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/item-description.hbs`,
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
