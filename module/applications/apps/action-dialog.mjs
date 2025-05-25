import { SYSTEM } from "../../config/system.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class ActionDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["magna", "dialog-action"],
    position: {
      width: 500,
      height: 345,
    },
    actions: {
      modificateurChange: this.modificateurChange,
      caracteristiqueChange: this.caracteristiqueChange,
      indiceChange: this.indiceChange,
    },
    tag: "form",
    window: {
      icon: "fa-solid fa-dice-d20",
    resizable: true,
    },
    form: {
      closeOnSubmit: true,
      submitOnChange: false,
      handler: this.#onSubmit,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: `systems/${SYSTEM.id}/templates/dice/action-dialog.hbs`,
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  };

  /**
   * Actions
   */
  static modificateurChange(event, target) {
    if (target.value.length && target.value !== this.options.context.modificateurLab) {
      this.options.context.modificateurLab = target.value;
      this.options.context.modificateur = parseInt(SYSTEM.DIFFICULTES[this.options.context.modificateurLab].modificateur);
      this.render();
    }
  }
  static caracteristiqueChange(event, target) {
    if (target.value.length && target.value !== this.options.context.field2) {
      this.options.context.group2 = "caracteristiques";
      this.options.context.field2 = target.value;
      this.render();
    }
  }
  static indiceChange(event, target) {
    if (target.value.length && target.value !== this.options.context.field2) {
      this.options.context.group2 = "indices";
      this.options.context.field2 = target.value;
      this.render();
    }
  }
  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  _onRender(context, options) {
    const oppositionChange = this.element.querySelectorAll(".oppositionChange");
    for (const input of oppositionChange) {
      input.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const newValue = e.currentTarget.value;
        this.options.context.opposition = parseInt(newValue);
      });
    }
  }
  /**
   * The final prompt value to return to the requester
   * @type {Array<object>}
   */
  promptValue = {};

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    options.context ??= {};
    //options.context.rollMode = game.settings.get("core", "rollMode");
    return super._initializeApplicationOptions(options);
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = this.options.context;
    //const context = options;
    foundry.utils.mergeObject(context, this.promptValue, {
      insertKeys: true,
      insertValues: true,
      overwrite: true,
    });
    context.caracteristiques = SYSTEM.CARACTERISTIQUES;
    context.indices = SYSTEM.INDICES;
    context.difficultes = SYSTEM.DIFFICULTES;
    if (context.group2 === "caracteristiques") {
      context.carac = context.field2;
      context.indice = "";
    } else if (context.group2 === "indices") {
      context.carac = "";
      context.indice = context.field2;
    }
    const actingChar = game.actors.get(context.actorId);
    context.label2 = await actingChar.getLabelShort(context.group2, context.typecomp2, context.field2);
    context.rollMode = this.options.rollMode || game.settings.get("core", "rollMode");

    context.buttons = [{ type: "submit", cssClass: "dialog-button", icon: "fa-solid fa-dice-d20", label: "MAGNA.DIALOG.throw" }];
    return context;
  }

  /**
   * Handle submitting the dialog.
   */
  static #onSubmit(formConfig, event) {
    foundry.utils.mergeObject(this.promptValue, this.options.context);
    //super.onSubmit(formConfig, event);
  }
  /* -------------------------------------------- */

  /**
   * Spawn a ActionDialog and wait for it to be rolled or closed.
   * @param {Partial<ApplicationConfiguration>} [options]
   * @returns {Promise<PowerRollDialogPrompt | null>}      Resolves to the final context to use for one or more power rolls.
   *                                                       If the dialog was closed without rolling, it resolves to null.
   */
  static async prompt(options) {
    return new Promise((resolve, reject) => {
      const dialog = new this(options);
      dialog.addEventListener(
        "close",
        (event) => {
          if (dialog.promptValue) resolve(dialog.promptValue);
          else resolve(null);
        },
        { once: true }
      );

      dialog.render({ force: true });
    });
  }
}
