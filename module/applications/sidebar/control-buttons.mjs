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
            new PresentationForm().render(true);
          },
        },
        {
          name: "aides",
          title: "Règles",
          icon: "fas fa-book-reader",
          button: true,
          onClick: () => {
            let journal = game.journal.get("dXJJuGB0cr1kzOgT");
            if (journal) journal.sheet.render(true, { pageId: "LpNxJ7anNICSRT8U", sheetMode: "text" });
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
