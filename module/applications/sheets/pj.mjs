import MagnaActorSheet from "./actor.mjs";

/**
 * Represents a character sheet for a player character (PJ).
 * Extends the MagnaActorSheet class.
 */
export default class PJSheet extends MagnaActorSheet {
  /**
   * The type of actor that this sheet displays.
   * @type {string}
   */
  static actorType = "pj";

  /** @override */
  async getData(options) {
    const context = await super.getData(options);

    if (game.settings.get("magna", "calculPex")) {
      context.autopex = true;
      context.pexvalue = this.actor.system.pex.total + this.actor.system.pex.creation - (await this.actor.pextotal());
    }
    return context;
  }
}
