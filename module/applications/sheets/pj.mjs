import MagnaActorSheet from "./actor.mjs";
import { SYSTEM } from "../../config/system.mjs";

/**
 * Represents a character sheet for a player character (PJ).
 * Extends the MagnaActorSheet class.
 */
export default class PJSheet extends MagnaActorSheet {
  static DEFAULT_OPTIONS = {
    id: "pj",
    classes: ["pj-sheet"],
    position: {
      width: 720,
      height: 900,
    },
    window: {
      title: "PjSheet.form.title",
    },
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabMode = true;
    context.showpex = true;
    if (game.settings.get("magna", "calculPex")) {
      context.autopex = true;
      context.pexvalue = this.actor.system.pex.total + this.actor.system.pex.creation - (await this.actor.pextotal());
    }
    return context;
  }
}
