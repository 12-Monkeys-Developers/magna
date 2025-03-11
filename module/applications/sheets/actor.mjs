import { SYSTEM } from "../../config/system.mjs";
const { api, sheets } = foundry.applications;

export default class MagnaActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM.id, "sheet", "actor", "actor-sheet", "scrollable"],
    resizable: true,

    actions: {
      toggleLockMode: this._toggleLockMode,
      newComp: this._onNewComp,
      editHTML: this._editHTML,
    },
    form: {
      submitOnChange: true,
    },

    tag: "form", // The default is "div"
    window: {
      resizable: true,
      icon: "fas fa-gear", // You can now add an icon to the header
    },
  };
  get title() {
    return `${game.i18n.localize("TYPES.Actor." + this.id)}`;
  }

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
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Add the item document.
    context.document = this.document;
    context.actor = this.actor;
    context.system = this.actor.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;
    context.descriptionhtml = await TextEditor.enrichHTML(this.actor.system.description, { async: false });
    context.nbAuraDeployees = this.actor.nbAuraDeployees;

    context.tabs = this._getTabs(["competences", "pouvoirs", "description"]);

    // pour afficher les indices PSI uniquement si le personnage a une valeur en PSI
    const showIndicePsi = this.document.system.caracteristiques.psi.max !== 0;
    context.indices = {
      cac: {
        valeur: this.actor.cac,
        label_short: "MAGNA.INDICE.cac.label_short",
        label: "MAGNA.INDICE.cac.label",
        showIndice: true,
      },
      cacpsi: {
        valeur: this.actor.cacpsi,
        label_short: "MAGNA.INDICE.cacpsi.label_short",
        label: "MAGNA.INDICE.cacpsi.label",
        showIndice: showIndicePsi,
      },
      dist: {
        valeur: this.actor.dist,
        label_short: "MAGNA.INDICE.dist.label_short",
        label: "MAGNA.INDICE.dist.label",
        showIndice: true,
      },
      distpsi: {
        valeur: this.actor.distpsi,
        label_short: "MAGNA.INDICE.distpsi.label_short",
        label: "MAGNA.INDICE.distpsi.label",
        showIndice: showIndicePsi,
      },
      ref: {
        valeur: this.actor.ref,
        label_short: "MAGNA.INDICE.ref.label_short",
        label: "MAGNA.INDICE.ref.label",
        showIndice: true,
      },
      refpsi: {
        valeur: this.actor.refpsi,
        label_short: "MAGNA.INDICE.refpsi.label_short",
        label: "MAGNA.INDICE.refpsi.label",
        showIndice: showIndicePsi,
      },
    };

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
    for (let element of context.pouvoirs) {
      element.system.descriptionhtml = await TextEditor.enrichHTML(element.system.description, { async: false });
    }
    return context;
  }
  /* -------------------------------------------------- */
  /*   Actions                                          */
  /* -------------------------------------------------- */

  /**
   * Toggle Lock vs. Unlock sheet
   *
   * @this ActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   */
  static async _toggleLockMode(event, target) {
    let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
    if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
    else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
    this.render();
  }
  /**
   * Generates the data for the generic tab navigation template
   * @param {string[]} parts An array of named template parts to render
   * @returns {Record<string, Partial<ApplicationTab>>}
   * @protected
   */
  _getTabs(parts) {
    // If you have sub-tabs this is necessary to change
    const tabGroup = "primary";
    // Default tab for first time it's rendered this session
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = "competences";
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: "",
        group: tabGroup,
        // Matches tab property to
        id: "",
        // FontAwesome Icon, if you so choose
        icon: "",
        // Run through localization
        tooltip: "MAGNA.actor.tabs.",
        active: false,
      };
      switch (partId) {
        case "header":
        case "tabs":
          return tabs;
        case "competences":
          tab.id = "competences";
          tab.tooltip += "competences";
          tab.icon = "fa-solid fa-chart-simple";
          break;
        case "pouvoirs":
          tab.id = "pouvoirs";
          tab.tooltip += "pouvoirs";
          tab.icon = "fa-solid fa-bolt";
          break;
        case "description":
          tab.id = "description";
          tab.tooltip += "description";
          tab.icon = "fa-regular fa-clipboard";
          break;
      }
      if (this.tabGroups[tabGroup] === tab.id) {
        tab.cssClass = "active";
        tab.active = true;
      }
      tabs[partId] = tab;
      return tabs;
    }, {});
  }

  /** @override */
  async _preparePartContext(partId, context, options) {
    await super._preparePartContext(partId, context, options);
    switch (partId) {
      case "competences":
        context.tab = context.tabs[partId];
        break;
      case "pouvoirs":
        context.tab = context.tabs[partId];
        break;
      case "description":
        context.tab = context.tabs[partId];
        break;
    }
    return context;
  }

  /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    foundry.applications.ui.ContextMenu.create(this, this.element, ".item-contextmenu", { hookName: "ItemEntryContext", jQuery: false, fixed: true });
    foundry.applications.ui.ContextMenu.create(this, this.element, ".std-contextmenu", { hookName: "StdContext", jQuery: false, fixed: true });
    if (game.settings.get("magna", "calculPex") && this.actor.isUnlocked)
      foundry.applications.ui.ContextMenu.create(this, this.element, ".pex-contextmenu", { hookName: "PexContext", jQuery: false, fixed: true });
  }

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  _onRender(context, options) {
    // Inputs with on class `compSpeEdit`
    const compSpe = this.element.querySelectorAll(".compSpeEdit");
    for (const input of compSpe) {
      // keep in mind that if your callback is a named function instead of an arrow function expression
      // you'll need to use `bind(this)` to maintain context
      input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const element = e.currentTarget;
        let compIndex = parseInt(element.dataset.id);
        let compType = element.dataset.type;
        let compField = element.dataset.field;
        let newValue = element.valueAsNumber ? element.valueAsNumber : element.value;
        this.actor.modifierCompSpe(compType, compIndex, compField, newValue);
      });
    }
  }

  /* Context menu standard*/
  _getStdContextOptions() {
    return [
      {
        name: `Afficher`,
        icon: `<i class="fa-regular fa-image-portrait"></i>`,
        condition: (li) => {
          return li.dataset.group === "portrait";
        },
        callback: (li) => {
          return this.actor.showPortrait();
        },
      },
      {
        name: `Jet d'Iniative`,
        icon: `<i class="fa-solid fa-hourglass-start"></i>`,
        condition: (li) => {
          return li.dataset.group === "init";
        },
        callback: (li) => {
          return this.actor.rollInit();
        },
      },
      {
        name: `Jet de Mental`,
        icon: `<i class="fa-solid fa-head-side-medical"></i>`,
        condition: (li) => {
          return li.dataset.group === "mental";
        },
        callback: async (li) => {
          const introText = game.i18n.format("MAGNA.CHATMESSAGE.introMental", { actingCharName: this.actor.name });
          let data = {
            group1: "mental",
            typecomp1: false,
            field1: "mental",
            group2: "mental",
            field2: "mental",
            askDialog: false,
            introText: introText,
          };
          return this.actor.rollAction(data);
        },
      },
      {
        name: `Jet simple`,
        icon: `<i class="fa-solid fa-dice-d20"></i>`,
        condition: (li) => {
          return ["competences", "competences_spe", "combat"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const compname = li.dataset.compname;
          const group = li.dataset.group;
          const introText = game.i18n.format("MAGNA.CHATMESSAGE.introActionStd", { actingCharName: this.actor.name });
          let data = {
            group1: group,
            typecomp1: false,
            field1: compname,
            group2: "caracteristiques",
            field2: "hab",
            askDialog: false,
            introText: introText,
          };
          if (group === "competences") {
            data.field2 = SYSTEM.COMPETENCES[compname].defaultCarac;
          } else if (group === "combat") {
            data.field2 = SYSTEM.COMPETENCES_COMBAT[compname].defaultCarac;
          } else if (group === "competences_spe") {
            const compSpe = await this.actor.lectureCompSpe(li.dataset.type, compname);
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
          return ["competences", "competences_spe", "combat", "indices", "caracteristiques"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const compname = li.dataset.compname;
          const group = li.dataset.group;
          const introText = game.i18n.format("MAGNA.CHATMESSAGE.introActionStd", { actingCharName: this.actor.name });
          let data = {
            group1: group,
            typecomp1: false,
            field1: compname,
            group2: "caracteristiques",
            field2: "hab",
            askDialog: true,
            introText: introText,
          };
          if (group === "competences") {
            data.field2 = SYSTEM.COMPETENCES[compname].defaultCarac;
          } else if (group === "combat") {
            data.field2 = SYSTEM.COMPETENCES_COMBAT[compname].defaultCarac;
          } else if (group === "competences_spe") {
            const compSpe = await this.actor.lectureCompSpe(li.dataset.type, compname);
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
          return ["competences_spe"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const compType = li.dataset.type;
          const compIndex = li.dataset.groupid;
          this.actor.supprimerCompSpe(compType, compIndex);
        },
      },
      {
        name: `Remettre au max`,
        icon: `<i class="fa-solid fa-gauge-max"></i>`,
        condition: (li) => {
          return ["mental", "vitalite", "caracteristiques"].includes(li.dataset.group);
        },
        callback: async (li) => {
          const group = li.dataset.group;
          if (group === "caracteristiques") {
            const compname = li.dataset.compname;
            return this.actor.setCaracToMax(compname);
          } else return this.actor.setToMax(group);
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
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir" && item.system.auraDeployee;
        },
        callback: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          const introText = game.i18n.format("MAGNA.CHATMESSAGE.introPouvoir", { pouvName: item.name, actingCharName: this.actor.name });
          const defaultAtt = item.system.defaultAtt;
          let group2 = SYSTEM.INDICES[defaultAtt] ? "indices" : "caracteristiques";
          let data = {
            group1: "pouvoir",
            typecomp1: false,
            field1: itemId,
            group2: group2,
            field2: defaultAtt,
            askDialog: true,
            introText: introText,
          };
          return this.actor.rollAction(data);
        },
      },
      {
        name: `Frapper / Tirer`,
        icon: `<i class="fa-regular fa-gun"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "arme";
        },
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this.actor.utiliserArme(itemId);
        },
      },
      {
        name: `Déployer l'aura (Jet d'action)`,
        icon: `<i class="fa-regular fa-person-rays"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir" && !item.system.auraDeployee;
        },
        callback: async (li) => {
          const itemId = li.dataset.itemId;
          if (await this.actor.deployerAura(itemId, false, false)) this.actor.sheet.render(true);
          return;
        },
      },
      {
        name: `Rétracter l'aura`,
        icon: `<i class="fa-regular fa-person"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir" && item.system.auraDeployee;
        },
        callback: async (li) => {
          const itemId = li.dataset.itemId;
          this.actor.retracterAura(itemId);
          return;
        },
      },
      {
        name: `Forcer l'aura (3 pts mental)`,
        icon: `<i class="fa-regular fa-person-rays"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir" && !item.system.auraDeployee;
        },
        callback: (li) => {
          const itemId = li.dataset.itemId;
          if (this.actor.deployerAura(itemId, true, false)) this.actor.sheet.render(true);
          return;
        },
      },
      {
        name: `Déployer l'aura sans jet ni coût`,
        icon: `<i class="fa-regular fa-person-rays"></i>`,
        condition: (li) => {
          const itemId = li.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (!item) return false;
          return item.type === "pouvoir" && !item.system.auraDeployee;
        },
        callback: (li) => {
          const itemId = li.dataset.itemId;
          if (this.actor.deployerAura(itemId, true, true)) this.actor.sheet.render(true);
          return;
        },
      },
      {
        name: `Détails`,
        icon: `<i class="fa-regular fa-cogs"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this._ouvrirItem(itemId);
        },
      },
      {
        name: `Supprimer`,
        icon: `<i class="fa-solid fa-trash"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.dataset.itemId;
          this._supprimerItem(itemId);
        },
      },
    ];
  }

  /* Context menu Pex*/
  _getPexContextOptions() {
    return [
      {
        name: `Fixer la valeur de création`,
        icon: `<i class="fa-solid fa-flag-checkered"></i>`,
        condition: (li) => {
          return game.user.isGM;
        },
        callback: async (li) => {
          await this.askBasePex();
          return;
        },
      },
    ];
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

  static async _onNewComp(event, target) {
    console.log("target", target);
    let compType = target.dataset.field;
    this.actor.ajouterCompSpe(compType);
    this.render();
  }

  async askBasePex() {
    const coutactuel = await this.actor.pextotal();
    const dialog_content = await renderTemplate(`systems/${SYSTEM.id}/templates/sheets/setpex-dialog.hbs`, { coutactuel: coutactuel });
    let x = new Dialog({
      content: dialog_content,
      buttons: {
        Ok: { label: `Ok`, callback: async (html) => await this.setBasePex(html.find("[name=pexbase]")[0].value) },
        Cancel: { label: `Cancel` },
      },
      default: "Ok",
    });

    x.options.width = 400;
    x.position.width = 400;

    x.render(true);
  }

  async setBasePex(creationValue) {
    const creationNumber = parseInt(creationValue);
    //const pexTotal = await this.actor.pextotal();
    await this.actor.update({ [`system.pex.creation`]: creationNumber });
    return this.actor.sheet.render(true);
  }
}
