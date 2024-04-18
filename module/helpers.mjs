import { SYSTEM } from "./config/system.mjs";

export const registerHandlebarsHelpers = function () {

  Handlebars.registerHelper("getSystemProperty", function (actor, group, nom_id, prop) {
    return actor.system[group][nom_id][prop];
  });
  
  Handlebars.registerHelper("getContrecoupText", function (actingCharName, result, degatsMentaux) {
    let contrecoupText = "";
    if (result < -9) contrecoupText = game.i18n.format("MAGNA.CHATMESSAGE.contrecoup.largereussite", { actingCharName: actingCharName, degatsMentaux: degatsMentaux });
    else if (result < 1) contrecoupText = game.i18n.format("MAGNA.CHATMESSAGE.contrecoup.reussite", { actingCharName: actingCharName, degatsMentaux: degatsMentaux });
    else if (result < 10) contrecoupText = game.i18n.format("MAGNA.CHATMESSAGE.contrecoup.rate", { actingCharName: actingCharName, degatsMentaux: degatsMentaux });
    else contrecoupText = game.i18n.format("MAGNA.CHATMESSAGE.contrecoup.completementrate", { actingCharName: actingCharName, degatsMentaux: degatsMentaux*2 });
    return contrecoupText;
  });
};
