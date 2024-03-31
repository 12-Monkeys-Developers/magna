export default class MagnaActorSheet extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      classes: [SYSTEM.id, "sheet", "actor", this.actorType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.actorType}.hbs`,
      resizable: true,
      scrollY: [],
    });
  }

  /** @override */
  async getData(options) {
    const context = {};
    context.editable = true;
    context.actor = this.document;
    context.system = this.document.system;

    return context;
  }

  /* Context menu standar*/
  _getStdContextOptions() {
    return [
      {
        name: `Jet d'Iniative`,
        icon: `<i class="fa-solid fa-hourglass-start"></i>`,
        condition: (li) => {
          return (li.data("cond")==="init");
        },
        callback: (li) => {
          return this.actor.rollInit();
        },
      },
    ]
  };
  /**
   * Retourne les context options des embedded items
   * @returns {object[]}
   * @private
   */
  _getItemEntryContextOptions() {
    return [
      {
        name: `Utiliser pouvoir (Jet d'action)`,
        icon: `<i class="fa-regular fa-bolt"></i>`,
        condition: (li) => {
          const itemId = li.data("itemId");
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir";
        },
        callback: (li) => {
          const itemId = li.data("itemId");
        },
      },
      {
        name: `Frapper / Tirer`,
        icon: `<i class="fa-regular fa-gun"></i>`,
        condition: (li) => {
          const itemId = li.data("itemId");
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "arme";
        },
        callback: (li) => {
          const itemId = li.data("itemId");
          this.actor.utiliserArme(itemId);
        },
      },
      {
        name: `Déployer l'aura (Jet d'action)`,
        icon: `<i class="fa-regular fa-person-rays"></i>`,
        condition: (li) => {
          const itemId = li.data("itemId");
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return ((item.type === "pouvoir")&& !item.system.auraDeployee);
        },
        callback: async (li) => {
          const itemId = li.data("itemId");
            if(await this.actor.deployerAura(itemId, false, false)) this.actor.sheet.render(true);;
            return;
        },
      },
      {
        name: `Rétracter l'aura`,
        icon: `<i class="fa-regular fa-person"></i>`,
        condition: (li) => {
          const itemId = li.data("itemId");
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return ((item.type === "pouvoir")&& item.system.auraDeployee);
        },
        callback: async (li) => {
          const itemId = li.data("itemId");
            if(this.actor.retracterAura(itemId)) this.actor.sheet.render(true);;
            return;
        },
      },
      {
        name: `Forcer l'aura`,
        icon: `<i class="fa-regular fa-person-rays"></i>`,
        condition: (li) => {
          const itemId = li.data("itemId");
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return ((item.type === "pouvoir")&& !item.system.auraDeployee);
        },
        callback: (li) => {
          const itemId = li.data("itemId");
            if(this.actor.deployerAura(itemId, true, false)) this.actor.sheet.render(true);;
            return;
        },
      },
      {
        name: `Détails`,
        icon: `<i class="fa-regular fa-cogs"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.data("itemId");
          this._ouvrirItem(itemId);
        },
      },
      {
        name: `Supprimer`,
        icon: `<i class="fa-solid fa-trash"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.data("itemId");
          this._supprimerItem(itemId);
        },
      },
    ];
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Lock/Unlock la fiche
    html.find(".change-lock").click(this._onSheetChangelock.bind(this));

    // Activate context menu
    this._contextMenu(html);
  }

  /** @inheritdoc */
  _contextMenu(html) {
    ContextMenu.create(this, html, ".item-contextmenu", this._getItemEntryContextOptions());
    ContextMenu.create(this, html, ".std-contextmenu", this._getStdContextOptions());
  }

  /**
   * Manage the lock/unlock button on the sheet
   *
   * @name _onSheetChangelock
   * @param {*} event
   */
  async _onSheetChangelock(event) {
    event.preventDefault();

    let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
    if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
    else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
    this.actor.sheet.render(true);
  }

  _ouvrirItem(itemId) {
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }
  
  async _supprimerItem(itemId) {
    let item = this.actor.items.get(itemId);
    if (item === null) {
      return;
    }
    let flagData = await this.actor.getFlag(game.system.id, itemId);
    if (flagData) await this.actor.unsetFlag(game.system.id, itemId);
    await this.actor.deleteEmbeddedDocuments("Item", [item.id], { render: true });
  }
}