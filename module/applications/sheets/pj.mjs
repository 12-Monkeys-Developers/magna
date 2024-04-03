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

}
