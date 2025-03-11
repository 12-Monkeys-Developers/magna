import MagnaActorSheet from "./actor.mjs";
import { SYSTEM } from "../../config/system.mjs";

/**
 * Represents a character sheet for a non player character (PNJ).
 * Extends the MagnaActorSheet class.
 */
export default class PNJSheet extends MagnaActorSheet {
  static DEFAULT_OPTIONS = {
    id: "pnj",
    classes: ["pnj-sheet"],
    position: {
      width: 720,
      height: 900,
    },
    window: {
      title: "PnjSheet.form.title",
    },
  };
  
  static PARTS = {
    header: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/actor-header.hbs`,
    },
    competences: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/actor-competences.hbs`,
    },
    pouvoirs: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/actor-pouvoirs.hbs`,
    },
    description: {
      template: `systems/${SYSTEM.id}/templates/sheets/partials/actor-description.hbs`,
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabMode = this.actor.isUnlocked;
    context.showpex = false;
    return context;
  }
}
