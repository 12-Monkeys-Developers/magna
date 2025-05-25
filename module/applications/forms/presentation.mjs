const { api, sheets } = foundry.applications;
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { SYSTEM } from "../../config/system.mjs";

export class PresentationForm extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM.id, "scrollable"],
    tag: "form",
    form: {
      submitOnChange: false,
      closeOnSubmit: false,
    },
    window: {
      resizable: true,
      icon: "fas fa-gear",
    },
    position: { width: 900 },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    // Add the item document.
    context.document = this.document;
    context.images = SYSTEM.IMAGES;

    return context;
  }
}

export class GuideSystPresentationForm extends PresentationForm {
  static DEFAULT_OPTIONS = {
    position: { height: 700},
    id: "guide-systeme",
  };

  static PARTS = {
    presentation: {
      template: `systems/magna/templates/forms/guide-systeme.hbs`,
    },
  };

  get title() {
    return "Présentation du système";
  }
}

export class AidePerceptionPresentationForm extends PresentationForm {
  static DEFAULT_OPTIONS = {
    position: { height: 640},
    id: "aide-perception",
  };

  static PARTS = {
    presentation: {
      template: `systems/magna/templates/forms/aide-perception.hbs`,
    },
  };

  get title() {
    return "Perception des auras";
  }
}

export class ContrecoupPresentationForm extends PresentationForm {
  static DEFAULT_OPTIONS = {
    position: { height: 700},
    id: "aide-contrecoup",
  };

  static PARTS = {
    presentation: {
      template: `systems/magna/templates/forms/aide-contrecoup.hbs`,
    },
  };

  get title() {
    return "Calcul du contrecoup";
  }
}