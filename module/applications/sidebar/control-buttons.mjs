import { GuideSystPresentationForm, AidePerceptionPresentationForm, ContrecoupPresentationForm } from "../forms/presentation.mjs";

export default function initControlButtons() {
  Hooks.on("getSceneControlButtons", (controls) => {
    if (game.user.isGM) {
      controls.magna = {
        activeTool: "presentation",
        name: "magna",
        title: "MAGNA",
        icon: "fas fa-claw-marks",
        tools: {
          presentation: {
            name: "presentation",
            title: "Présentation du système",
            icon: "fas fa-question",
            onChange: (event, active) => {
              new GuideSystPresentationForm().render(true);
            },
            button: true
          },
          perception_auras: {
            name: "perception_auras",
            title: "Perception des auras",
            icon: "fas fa-eye",
            button: true,
            onChange: (event, active) => {
              new AidePerceptionPresentationForm().render(true);
            },
          },
          contrecoup: {
            name: "contrecoup",
            title: "Contrecoup",
            icon: "far fa-head-side-medical",
            button: true,
            onChange: (event, active) => {
              new ContrecoupPresentationForm().render(true);
            },
          },
        },
      };
    }
  });
}
