(() => {
  let dialog_content = `  
    <div class="dialog">
        <div style="width:100%; text-align:center">
            <h3>Importation de PNJ</h3>
        </div>
        <div class="advantage">
            <label for="npcname">Indiquer le nom du PNJ</label>
            <input name="npcname" type="text">
            <label for="npctext">Collez ici les données du PNJ depuis le PDF</label>
            <input name="npctext" type="text">
        </div>
    </div>`;

  let x = new Dialog({
    content: dialog_content,
    buttons: {
      Ok: { label: `Ok`, callback: async (html) => await extractAllData(html.find("[name=npcname]")[0].value, html.find("[name=npctext]")[0].value) },
      Cancel: { label: `Cancel` },
    },
  });

  x.options.width = 400;
  x.position.width = 400;

  x.render(true);
})();

async function extractAllData(nameRawData, npcRawData) {
  let attributeArray;
  let skilllist;
  let npcData = npcRawData.replace(/[\r|\n]/g, "");
  //console.log("npcRawData: ", npcRawData);
  let additionalInfo = "";

  let extractData = function (inputData, inputPattern, attributePatternBoss) {
    let tmp = inputData.match(inputPattern);
    //     console.log("tmp: ", tmp);

    if (tmp != null && tmp.length >= 2) {
      // successful match
      if (attributePatternBoss) {
        let tmp2 = inputData.match(attributePatternBoss);
        //console.log("tmp2: ", tmp2);
        if (tmp2 != null && tmp2.length >= 2) {
          return [tmp[1], tmp2[1]];
        } else return [tmp[1], tmp[1]];
      }
      return tmp[1];
    }
    return "";
  };

  let extractMultData = function (inputData, inputPattern) {
    let tmp = inputData.match(inputPattern);
    //console.log("tmp: ", tmp);

    if (tmp != null && tmp.length >= 1) {
      return tmp;
    }
    return [];
  };

  let cleanUpText = function (textBlob) {
    if (!textBlob) return "";
    if (textBlob.length === 0) return "";
    textBlob = textBlob.trim();
    if (textBlob.length === 0) return "";
    let cleanData = textBlob.charAt(0).toUpperCase() + textBlob.slice(1);
    return cleanData;
  };
  let cleanUpTextLow = function (textBlob) {
    if (!textBlob) return "";
    if (textBlob.length === 0) return "";
    textBlob = textBlob.trim();
    if (textBlob.length === 0) return "";
    let cleanData = textBlob.charAt(0).toUpperCase() + textBlob.slice(1).toLowerCase();
    return cleanData;
  };

  let controlDoc;

  let expectedData = npcData.replace(/- /g, "");
  let filename= nameRawData.replace(/ /g, "_").toLowerCase();
  let newValues = {
    name: nameRawData,
    type: "pnj",
    folder: "",
    sort: 12000,
    system: {},
    token: {},
    items: [],
    flags: {},
  };
  //attributs

  attributePattern = /VIG ([0-9]+)/;
  let resultPattern = extractData(expectedData, attributePattern);
  console.log("VIG: ", resultPattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.vig.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.vig.max", parseInt(resultPattern));

  attributePattern = / PSI ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.psi.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.psi.max", parseInt(resultPattern));

  attributePattern = /PER ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.per.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.per.max", parseInt(resultPattern));

  attributePattern = /HAB ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.hab.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.hab.max", parseInt(resultPattern));

  attributePattern = /CHA ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.cha.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.cha.max", parseInt(resultPattern));

  attributePattern = /INT ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.int.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.int.max", parseInt(resultPattern));

  attributePattern = /AGI ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.agi.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.agi.max", parseInt(resultPattern));

  attributePattern = /INS ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.ins.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.ins.max", parseInt(resultPattern));

  attributePattern = /VOL ([0-9]+)/;
  resultPattern = extractData(expectedData, attributePattern);
  foundry.utils.setProperty(newValues, "system.caracteristiques.vol.valeur", parseInt(resultPattern));
  foundry.utils.setProperty(newValues, "system.caracteristiques.vol.max", parseInt(resultPattern));

//Competences

attributePattern = /Acrobatie[s] ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.acrobaties.valeur", parseInt(resultPattern));

attributePattern = /Athlétisme ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.athletisme.valeur", parseInt(resultPattern));

attributePattern = /Bluff ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.bluff.valeur", parseInt(resultPattern));

attributePattern = /Camouflage ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.camouflage.valeur", parseInt(resultPattern));

attributePattern = /Clairvoyance ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.clairvoyance.valeur", parseInt(resultPattern));

attributePattern = /Crochetage ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.crochetage.valeur", parseInt(resultPattern));

attributePattern = /Dérober ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.derober.valeur", parseInt(resultPattern));

attributePattern = /Discrétion ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.discretion.valeur", parseInt(resultPattern));

attributePattern = /Empathie ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.empathie.valeur", parseInt(resultPattern));

attributePattern = /Filature ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.filature.valeur", parseInt(resultPattern));

attributePattern = /Forcer ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.forcer.valeur", parseInt(resultPattern));

attributePattern = /Fouille ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.fouille.valeur", parseInt(resultPattern));

attributePattern = /Interroger ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.interroger.valeur", parseInt(resultPattern));

attributePattern = /Intimider ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.intimider.valeur", parseInt(resultPattern));

attributePattern = /Jeux ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.jeux.valeur", parseInt(resultPattern));

attributePattern = /Mémoire ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.memoire.valeur", parseInt(resultPattern));

attributePattern = /Observation ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.observation.valeur", parseInt(resultPattern));

attributePattern = /Résistance ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.resistance.valeur", parseInt(resultPattern));

attributePattern = /Séduction ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.seduction.valeur", parseInt(resultPattern));

attributePattern = /Self Control ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.selfcontrol.valeur", parseInt(resultPattern));

attributePattern = /Se renseigner ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.serenseigner.valeur", parseInt(resultPattern));

attributePattern = /S’informe ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.sinformer.valeur", parseInt(resultPattern));

attributePattern = /Soins ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.soins.valeur", parseInt(resultPattern));

attributePattern = /Survie ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.competences.survie.valeur", parseInt(resultPattern));




attributePattern = /Mains nues ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.combat.mainsnues.valeur", parseInt(resultPattern));

attributePattern = /Esquive ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.combat.survie.valeur", parseInt(resultPattern));

attributePattern = /Parade ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.combat.survie.valeur", parseInt(resultPattern));

attributePattern = /Arme[s] blanche[s] ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.combat.armeblanche.valeur", parseInt(resultPattern));
attributePattern = /Arme à feu légère ([0-9]+)/;
resultPattern = extractData(expectedData, attributePattern);
if(resultPattern) foundry.utils.setProperty(newValues, "system.combat.armefeu.valeur", parseInt(resultPattern));
attributePattern = /Arme lourde ([0-9]+)/;




  foundry.utils.setProperty(newValues, "img", "modules/magna-fanmade/assets/portraits/"+filename+".webp");
  foundry.utils.setProperty(newValues, "prototypeToken.texture.src", "modules/magna-fanmade/assets/portraits/"+filename+"_token.webp");

  let actor = await Actor.create(newValues);

  //tweak to insure that createActor hooks have been processed
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sleep(2000).then(async () => {
    //Acquis
    actor.setToMax("mental");
    actor.setToMax("vitalite");
    console.log(filename)
  });
}
