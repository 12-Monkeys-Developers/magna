import { SYSTEM } from "../config/system.mjs";

/**
 * Prompt the user to perform a Standard Check.
 * @extends {Dialog}
 */
export default class ActionDialog extends Dialog {
  /**
   * A StandardCheck dice instance which organizes the data for this dialog
   * @type {StandardCheck}
   */
  roll = this.options.roll;

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 500,
      height: 300,
      classes: ["magna", "roll"],
      template: `systems/${SYSTEM.id}/templates/dice/standard-check-dialog.hbs`,
      submitOnChange: true,
      closeOnSubmit: false,
    });
  }

  /** @override */
  async getData(options = {}) {
    const data = this.roll.data;
    const context = await super.getData(options);
    data.caracteristiques= SYSTEM.CARACTERISTIQUES;
    data.indices= SYSTEM.INDICES;
    //data optionsBonus = [{ indice: index + 1, label: index + 1 }]Array.from({ length: data.actorData.perisprit }, (_, index) => ({ indice: index + 1, label: index + 1 }));
    if(data.group2==="caracteristiques") context.carac = data.field2;
    else if(data.group2==="indices") context.indice = data.field2;
    context.rollMode = this.options.rollMode || game.settings.get("core", "rollMode");

    return foundry.utils.mergeObject(context, data);
  }

  /** @override */
  activateListeners(html) {
    html.find('select[class="changefield"]').change(this._onChangeAction.bind(this));
    html.find('input[class="changefield"]').change(this._onChangeAction.bind(this));
    super.activateListeners(html);
  }


  /**
   * Handle execution of one of the dialog roll actions
   * @private
   */
  _onChangeAction(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const newValue = event.currentTarget.value;
    const actionMap = {
      "caracteristique-change": () => ({ group2: "caracteristiques", field2: newValue }),
      "indice-change": () => ({ group2: "indices", field2: newValue }),
      "modificateur-change": () => ({ modificateur: parseInt(newValue)}),
      "opposition-change": () => ({ opposition: parseInt(newValue)}),
      "rollMode-change": () => ({ rollMode: newValue }),
    };
  
    if (actionMap[action]) {
      this.roll.initialize(actionMap[action]());
      this.render(false, { height: "auto" });
    }
  }





  /*  Factory Methods                             */

  /** @inheritdoc */
  static async prompt(config = {}) {
    config.callback = this.prototype._onSubmit;
    config.options.jQuery = false;
    config.rejectClose = false;
    return super.prompt(config);
  }

  /**
   * Return dialog submission data as a form data object
   * @param {HTMLElement} html    The rendered dialog HTML
   * @returns {StandardCheck}     The processed StandardCheck instance
   * @private
   */
  _onSubmit(html) {
    const form = html.querySelector("form");
    const fd = new FormDataExtended(form);
    this.roll.initialize(fd.object);
    return this.roll;
  }
}
