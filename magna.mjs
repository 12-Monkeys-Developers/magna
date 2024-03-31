import { SYSTEM } from "./module/config/system.mjs";
import initControlButtons from "./module/applications/sidebar/control-buttons.mjs";
import { SearchChat } from "./module/applications/search/research.mjs";

globalThis.SYSTEM = SYSTEM;

// Import modules
import * as applications from "./module/applications/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/data/_module.mjs";

Hooks.once("init", async function () {
  console.log(`magna - Initialisation du système...`);
  game.system.CONST = SYSTEM;

  CONFIG.Actor.documentClass = documents.MagnaActor;
  CONFIG.Actor.dataModels = {
    pj: models.MagnaPJ,
    pnj: models.MagnaPNJ,
  };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(SYSTEM.id, applications.PJSheet, { types: ["pj"], makeDefault: true });
  Actors.registerSheet(SYSTEM.id, applications.PNJSheet, { types: ["pnj"], makeDefault: true });

  // Configuration document Item
  CONFIG.Item.documentClass = documents.MagnaItem;

  CONFIG.Item.dataModels = {
    pouvoir: models.MagnaPouvoir,
    arme: models.MagnaArme
  };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(SYSTEM.id, applications.PouvoirSheet, { types: ["pouvoir"], makeDefault: true });
  Items.registerSheet(SYSTEM.id, applications.ArmeSheet, { types: ["arme"], makeDefault: true });

  
  // Dice system configuration
  CONFIG.Dice.rolls.push(dice.StandardCheck);

  loadTemplates([
    `systems/${SYSTEM.id}/templates/sheets/partials/pj-competences.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/pj-competences-spe.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/pj-pouvoirs.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/pj-description.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/pj.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/arme.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/pouvoir.hbs`,
  ]);

  // menu de gauche
  initControlButtons();

  Handlebars.registerHelper("getSystemProperty", function (actor, group, nom_id, prop) {
    return actor.system[group][nom_id][prop];
  });

});

Hooks.once("ready", async function () {
  console.log("Magna - Initialisation du système finie");

});

Hooks.once("i18nInit", function () {
  // Prélocalisation des objets de configuration
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
      }
    }
  };

  localizeConfigObject(SYSTEM.CARACTERISTIQUES, ["label"]);
  localizeConfigObject(SYSTEM.INDICES, ["label"]);
  localizeConfigObject(SYSTEM.COMPETENCES, ["label"]);
  localizeConfigObject(SYSTEM.COMPETENCES_COMBAT, ["label"]);
  localizeConfigObject(SYSTEM.DOMAINES, ["label"]);
  localizeConfigObject(SYSTEM.DIFFICULTES, ["label"]);
}

Hooks.on("renderChatMessage", (message, html, data) => {
  console.debug("renderChatMessage", message, html, data);

  const typeMessage = data.message.flags.world?.type;
  // ******  CODE FOR SEARCH 
  if (typeMessage === "searchPage") {
    html.find("#ouvrirpage").click((event) => SearchChat.onOpenJournalPage(event, data.message.flags.world?.searchPattern));
  }
  // ******  END OF CODE FOR SEARCH 
});