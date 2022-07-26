// import p5 = require("p5");
import { Projectile } from "./projectile";
import * as p5 from "p5";

let myp5: p5 = new p5((sketch) => {
  let target: Projectile, rocket: Projectile;

  let P_GAIN: Element,
    I_GAIN: Element,
    D_GAIN: Element,
    INT_SATURATION: Element,
    POWER: Element,
    DEBUG_MODE: Element;

  function makeP(): void {
    target = new Projectile(
      sketch.createVector(sketch.width, sketch.height),
      sketch
        .createVector(200, 0)
        .setHeading(sketch.radians(sketch.random(-165, -135))),
      sketch.createVector(0, 0),
      500
    );
    target.displayWidth = sketch.width;
    target.displayHeight = sketch.height;

    rocket = new Projectile(
      sketch.createVector(sketch.width / 2, sketch.height),
      sketch.createVector(0, 0),
      sketch.createVector(0, 0),
      500
    );
    rocket.displayWidth = sketch.width;
    rocket.displayHeight = sketch.height;
  }

  function applyInputs(): void {
    let input: HTMLInputElement;

    input = document.getElementById("P_GAIN") as HTMLInputElement;
    rocket.P_GAIN = Number(input.value);
    input = document.getElementById("I_GAIN") as HTMLInputElement;
    rocket.I_GAIN = Number(input.value);
    input = document.getElementById("D_GAIN") as HTMLInputElement;
    rocket.D_GAIN = Number(input.value);
    input = document.getElementById("INT_SATURATION") as HTMLInputElement;
    rocket.INT_SATURATION = Number(input.value);
    input = document.getElementById("POWER") as HTMLInputElement;
    rocket.POWER = Number(input.value);
    input = document.getElementById("DEBUG_MODE") as HTMLInputElement;
    rocket.DEBUG_MODE = Boolean(input.checked);
    input = document.getElementById("DEBUG_MODE") as HTMLInputElement;
    target.DEBUG_MODE = Boolean(input.checked);
  }

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    sketch
      .createButton("Reset")
      .id("RESET")
      .position(137, 120)
      .mousePressed(makeP);

    makeP();
    applyInputs();
  };

  sketch.draw = () => {
    sketch.background(67);
    sketch.noStroke();
    sketch.fill(200, 150);
    sketch.rect(0, 0, 190, 143);

    applyInputs();

    target.update();
    rocket.update();

    target.show(sketch);
    rocket.show(sketch);
  };

  sketch.mouseClicked = () => {
    if (sketch.mouseX > 190 && sketch.mouseY > 143) {
      rocket.target = target;
    }
  };
});
