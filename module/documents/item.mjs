export default class MagnaItem extends Item {

    get isUnlocked() {
      if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
      return false;
    }
}