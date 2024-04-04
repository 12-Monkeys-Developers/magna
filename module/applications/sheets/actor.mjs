export default class MagnaActorSheet extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      classes: [SYSTEM.id, "sheet", "actor", this.actorType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.actorType}.hbs`,
      resizable: true,
      scrollY: [],
      width: 720,
      height: 900,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "competences" }],
    });
  }

  /** @override */
  async getData(options) {
    const context = {};
    context.editable = true;
    context.actor = this.document;
    context.system = this.document.system;

    context.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description, { async: false });
    context.equipementHTML = await TextEditor.enrichHTML(this.actor.system.equipement, { async: false });
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;
    context.sheetlight = this.actor.sheetlight;
    context.nbAuraDeployees = this.actor.nbAuraDeployees;
    context.indices = {
      cac: {
        valeur: this.actor.cac,
        label_short: "MAGNA.INDICE.cac.label_short",
        label: "MAGNA.INDICE.cac.label",
      },
      cacpsi: {
        valeur: this.actor.cacpsi,
        label_short: "MAGNA.INDICE.cacpsi.label_short",
        label: "MAGNA.INDICE.cacpsi.label",
      },
      dist: {
        valeur: this.actor.dist,
        label_short: "MAGNA.INDICE.dist.label_short",
        label: "MAGNA.INDICE.dist.label",
      },
      distpsi: {
        valeur: this.actor.distpsi,
        label_short: "MAGNA.INDICE.distpsi.label_short",
        label: "MAGNA.INDICE.distpsi.label",
      },
      ref: {
        valeur: this.actor.ref,
        label_short: "MAGNA.INDICE.ref.label_short",
        label: "MAGNA.INDICE.ref.label",
      },
      refpsi: {
        valeur: this.actor.refpsi,
        label_short: "MAGNA.INDICE.refpsi.label_short",
        label: "MAGNA.INDICE.refpsi.label",
      },
    };
    context.vitalite_max = this.actor.vitalite_max;
    context.mental_max = this.actor.mental_max;

    // Pouvoirs par ordre niveau et mise en forme de la description

    context.listevoies = this.actor.listeVoies;

    context.armes = this.actor.items
      .filter((item) => item.type == "arme")
      .sort(function (a, b) {
        return a.name > b.name;
      });
    context.armes.forEach(async (element) => {
      element.system.degatsmodifies = await this.actor.degatsmodifies(element._id);
    });
    context.pouvoirs = this.actor.items
      .filter((item) => item.type == "pouvoir")
      .sort(function (a, b) {
        return a.system.rang > b.system.rang;
      });
    context.pouvoirs.forEach(async (element) => {
      element.system.descriptionhtml = await TextEditor.enrichHTML(element.system.description, { async: false });
    });

    return context;
  }

  /* Context menu standar*/
  _getStdContextOptions() {
    return [
      {
        name: `Jet d'Iniative`,
        icon: `<i class="fa-solid fa-hourglass-start"></i>`,
        condition: (li) => {
          return li.data("group") === "init";
        },
        callback: (li) => {
          return this.actor.rollInit();
        },
      },
      {
        name: `Jet de Mental`,
        icon: `<i class="fa-solid fa-head-side-medical"></i>`,
        condition: (li) => {
          return li.data("group") === "mental";
        },
        callback: async (li) => {
          let data = {
            group1: "mental",
            typecomp1: false,
            field1: "mental",
            group2: "mental",
            field2: "mental",
            askDialog: false,
          };
          return this.actor.rollAction(data);
        },
      },
      {
        name: `Jet simple`,
        icon: `<i class="fa-solid fa-dice-d20"></i>`,
        condition: (li) => {
          return ["competences", "competences_spe", "combat"].includes(li.data("group"));
        },
        callback: async (li) => {
          const compname = li.data("compname");
          const group = li.data("group");
          let data = {
            group1: group,
            typecomp1: false,
            field1: compname,
            group2: "caracteristiques",
            field2: "hab",
            askDialog: false,
          };
          if (group === "competences") {
            data.field2 = SYSTEM.COMPETENCES[compname].defaultCarac;
          } else if (group === "combat") {
            data.field2 = SYSTEM.COMPETENCES_COMBAT[compname].defaultCarac;
          } else if (group === "competences_spe") {
            const compSpe = await this.actor.lectureCompSpe(li.data("type"), compname);
            data.field1 = compSpe;
            data.field2 = compSpe.defaultCarac;
          }
          return this.actor.rollAction(data);
        },
      },
      {
        name: `Jet modifiable`,
        icon: `<i class="fa-solid fa-dice-d20"></i>`,
        condition: (li) => {
          return ["competences", "competences_spe", "combat", "indices", "caracteristiques"].includes(li.data("group"));
        },
        callback: async (li) => {
          const compname = li.data("compname");
          const group = li.data("group");
          let data = {
            group1: group,
            typecomp1: false,
            field1: compname,
            group2: "caracteristiques",
            field2: "hab",
            askDialog: true,
          };
          if (group === "competences") {
            data.field2 = SYSTEM.COMPETENCES[compname].defaultCarac;
          } else if (group === "combat") {
            data.field2 = SYSTEM.COMPETENCES_COMBAT[compname].defaultCarac;
          } else if (group === "competences_spe") {
            const compSpe = await this.actor.lectureCompSpe(li.data("type"), compname);
            data.field1 = compSpe;
            data.field2 = compSpe.defaultCarac;
          }
          return this.actor.rollAction(data);
        },
      },
      {
        name: `Supprimer`,
        icon: `<i class="fa-solid fa-trash"></i>`,
        condition: (li) => {
          return ["competences_spe"].includes(li.data("group"));
        },
        callback: async (li) => {
          const compType = li.data("type");
          const compIndex = li.data("id");
          this.actor.supprimerCompSpe(compType, compIndex);
        },
      },
      {
        name: `Remettre au max`,
        icon: `<i class="fa-solid fa-gauge-max"></i>`,
        condition: (li) => {
          return ["mental", "vitalite", "caracteristiques"].includes(li.data("group"));
        },
        callback: async (li) => {
          const group = li.data("group");
          if (group === "caracteristiques") {
            const compname = li.data("compname");
            return this.actor.setCaracToMax(compname);
          }
          else return this.actor.setToMax(group);
        },
      },
    ];
  }
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
          let data = {
            group1: "pouvoir",
            typecomp1: false,
            field1: itemId,
            group2: "indices",
            field2: "distpsi",
            askDialog: true,
          };
          return this.actor.rollAction(data);
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
          return item.type === "pouvoir" && !item.system.auraDeployee;
        },
        callback: async (li) => {
          const itemId = li.data("itemId");
          if (await this.actor.deployerAura(itemId, false, false)) this.actor.sheet.render(true);
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
          return item.type === "pouvoir" && item.system.auraDeployee;
        },
        callback: async (li) => {
          const itemId = li.data("itemId");
          if (this.actor.retracterAura(itemId)) this.actor.sheet.render(true);
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
          return item.type === "pouvoir" && !item.system.auraDeployee;
        },
        callback: (li) => {
          const itemId = li.data("itemId");
          if (this.actor.deployerAura(itemId, true, false)) this.actor.sheet.render(true);
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

    // Traitement des compétences spécialisées
    html.find(".new-comp").click(this._onNewComp.bind(this));
    html.find(".compspe-edit").change(this._onCompSpeEdit.bind(this));
    html.find(".compspe-delete").click(this._onCompSpeDelete.bind(this));

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

  /**
   * Event handler for the new comp click event.
   * @param {Event} event - The click event.
   */
  async _onNewComp(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compType = element.dataset.field;
    this.actor.ajouterCompSpe(compType);
  }
  async _onCompSpeEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compIndex = parseInt(element.dataset.id);
    let compType = element.dataset.type;
    let compField = element.dataset.field;
    let newValue = element.valueAsNumber ? element.valueAsNumber : element.value;
    this.actor.modifierCompSpe(compType, compIndex, compField, newValue);
  }
  async _onCompSpeDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let compIndex = parseInt(element.dataset.id);
    let compType = element.dataset.type;
    this.actor.supprimerCompSpe(compType, compIndex);
  }
}
