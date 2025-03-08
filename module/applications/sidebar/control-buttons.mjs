import { PresentationForm } from "../forms/presentation.mjs";

export default function initControlButtons() {
  Hooks.on("getSceneControlButtons", (controls) => {
    if (game.user.isGM) {
      controls.magna = {
        name: "magna",
        title: "MAGNA",
        icon: "fas fa-claw-marks",
        tools: {
          presentation: {
            name: "presentation",
            title: "Présentation du système",
            icon: "fas fa-question",
            onChange: (event, active) => {
              new PresentationForm(null, { template: `systems/magna/templates/forms/guide-systeme.hbs`, height: 700 }).render(true);
            },
            button: true,
          },
          perception_auras: {
            name: "perception_auras",
            title: "Perception des auras",
            icon: "fas fa-eye",
            button: true,
            onChange: (event, active) => {
              new PresentationForm(null, { template: `systems/magna/templates/forms/aide-perception.hbs`, height: 640 }).render(true);
            },
          },
          contrecoup: {
            name: "contrecoup",
            title: "Contrecoup",
            icon: "far fa-head-side-medical",
            button: true,
            onChange: (event, active) => {
              new PresentationForm(null, { template: `systems/magna/templates/forms/aide-contrecoup.hbs`, height: 700 }).render(true);
            },
          },
        },
      };
    }
  });
}
