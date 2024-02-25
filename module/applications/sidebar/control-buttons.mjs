import { PresentationForm } from "../forms/presentation.mjs";
import { SearchDialog } from "../search/research.mjs";

export default function initControlButtons() {
  CONFIG.Canvas.layers.magna = { layerClass: ControlsLayer, group: "primary" };

  Hooks.on("getSceneControlButtons", (btns) => {
    let menu = [];

    menu.push(
      {
        name: "presentation",
        title: "Présentation du système",
        icon: "fas fa-question",
        button: true,
        onClick: () => {
          new PresentationForm().render(true);
        },
      }
    );
    // ******  CODE FOR SEARCH 
    if (game.user.isGM) {
      menu.push({
        name: "search",
        title: "Recherche",
        icon: "fas fa-magnifying-glass",
        button: true,
        onClick: async () => {
          let searchDialog = await new SearchDialog().render(true);
        },
      });
    }
    // ******  END OF CODE FOR SEARCH 
    btns.push({
      name: "magna_menu",
      title: "Magna",
      icon: "fab fa-wolf-pack-battalion",
      layer: "magna",
      tools: menu,
    });
  });
}
