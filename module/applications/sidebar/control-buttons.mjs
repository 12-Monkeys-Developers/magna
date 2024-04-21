import { PresentationForm } from "../forms/presentation.mjs";
import { SearchDialog } from "../search/research.mjs";

export default function initControlButtons() {
  CONFIG.Canvas.layers.magna = { layerClass: ControlsLayer, group: "primary" };

  Hooks.on("getSceneControlButtons", (btns) => {
    let menu = [];

    menu.push();
    if (game.user.isGM) {
      menu.push(
        {
          name: "presentation",
          title: "Présentation du système",
          icon: "fas fa-question",
          button: true,
          onClick: () => {
            new PresentationForm(null, { template: `systems/magna/templates/forms/guide-systeme.hbs`, height: 700 }).render(true);
          },
        },
        {
          name: "perception_auras",
          title: "Perception des auras",
          icon: "fas fa-eye",
          button: true,
          onClick: () => {
            new PresentationForm(null, { template: `systems/magna/templates/forms/aide-perception.hbs`, height: 400 }).render(true);
          },
        },
        {
          name: "contrecoup",
          title: "Contrecoup",
          icon: "far fa-head-side-medical",
          button: true,
          onClick: () => {
            new PresentationForm(null, { template: `systems/magna/templates/forms/aide-contrecoup.hbs`, height: 700 }).render(true);
          },
        },
        {
          name: "search",
          title: "Recherche",
          icon: "fas fa-magnifying-glass",
          button: true,
          onClick: async () => {
            let searchDialog = await new SearchDialog().render(true);
          },
        }
      );
    }
    // ******  END OF CODE FOR SEARCH
    btns.push({
      name: "magna_menu",
      title: "MAGNA",
      icon: "fab fa-wolf-pack-battalion",
      layer: "magna",
      tools: menu,
    });
  });
}
