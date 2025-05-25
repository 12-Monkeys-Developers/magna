import { SYSTEM } from "./module/config/system.mjs";
import initControlButtons from "./module/applications/sidebar/control-buttons.mjs";
import { registerHandlebarsHelpers } from "./module/helpers.mjs";

globalThis.SYSTEM = SYSTEM;

// Import modules
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/data/_module.mjs";
import * as rolls from "./module/applications/rolls/_module.mjs";

Hooks.once("init", async function () {
  console.log(`MAGNA - Initialisation du système...`);
  game.system.CONST = SYSTEM;

  CONFIG.Actor.documentClass = documents.MagnaActor;
  CONFIG.Actor.dataModels = {
    pj: models.MagnaPJ,
    pnj: models.MagnaPNJ,
  };
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(SYSTEM.id, applications.PJSheet, { types: ["pj"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet(SYSTEM.id, applications.PNJSheet, { types: ["pnj"], makeDefault: true });

  // Configuration document Item
  CONFIG.Item.documentClass = documents.MagnaItem;
  CONFIG.Combat.documentClass = documents.MagnaCombat;

  CONFIG.Item.dataModels = {
    pouvoir: models.MagnaPouvoir,
    arme: models.MagnaArme
  };

  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.PouvoirSheet, { types: ["pouvoir"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(SYSTEM.id, applications.ArmeSheet, { types: ["arme"], makeDefault: true });

  
  // Dice system configuration
  CONFIG.Dice.rolls.push(rolls.ActionRoll);

  foundry.applications.handlebars.loadTemplates([
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-header.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-competences.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-competences-spe.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-pouvoirs.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-description.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/parts/unlock-icon.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/arme.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/pouvoir.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/setpex-dialog.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/contrecoup-dialog.hbs`
  ]);

  // left menu
  initControlButtons();

  //configuration Handlebars
  registerHandlebarsHelpers();

  game.settings.register("magna", "calculPex", {
    name: "Calcul des Pex",
    hint: "Calcul automatique des dépenses de points d'expérience.",
    scope: "world",
    config: true,
    type: Boolean,
    choices: {
      true: "Automatique",
      false: "Manuel"
    },
    requiresReload: true,
    default: "false",
  });

  game.settings.register("magna", "excludePsi", {
    name: "Exclure PSI du calcul des Pex",
    hint: "La valeur de PSI n'est pas décomptée du calcul des points d'expérience.",
    scope: "world",
    config: true,
    type: Boolean,
    choices: {
      true: "Exclure",
      false: "Inclure"
    },
    requiresReload: true,
    default: "false",
  });

  game.settings.register("magna", "coutParRang", {
    name: "Coût des pouvoirs",
    hint: "Mettre le coût en points d'expérience des pouvoirs à 10 points par rang plutôt que 10 points par pouvoir.",
    scope: "world",
    config: true,
    type: Boolean,
    choices: {
      true: "10 points par pouvoir",
      false: "10*Rang points par pouvoir"
    },
    requiresReload: true,
    default: "false",
  });

  game.settings.register("magna", "aff_domaines", {
    name: "Affichage des domaines",
    hint: "Permet aux joueurs et joueuses de voir le domaine auquel est rattaché un pouvoir.",
    scope: "world",
    config: true,
    type: Boolean,
    requiresReload: false,
    default: "false",
  });

});

Hooks.once("ready", async function () {
  console.log("MAGNA - Initialisation du système finie");

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
