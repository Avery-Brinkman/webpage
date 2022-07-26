"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import p5 = require("p5");
const projectile_1 = require("./projectile");
const p5 = require("p5");
let myp5 = new p5((sketch) => {
    let target, rocket;
    let P_GAIN, I_GAIN, D_GAIN, INT_SATURATION, POWER, DEBUG_MODE;
    function makeP() {
        target = new projectile_1.Projectile(sketch.createVector(sketch.width, sketch.height), sketch
            .createVector(200, 0)
            .setHeading(sketch.radians(sketch.random(-165, -135))), sketch.createVector(0, 0), 500);
        target.displayWidth = sketch.width;
        target.displayHeight = sketch.height;
        rocket = new projectile_1.Projectile(sketch.createVector(sketch.width / 2, sketch.height), sketch.createVector(0, 0), sketch.createVector(0, 0), 500);
        rocket.displayWidth = sketch.width;
        rocket.displayHeight = sketch.height;
    }
    function applyInputs() {
        let input;
        input = document.getElementById("P_GAIN");
        rocket.P_GAIN = Number(input.value);
        input = document.getElementById("I_GAIN");
        rocket.I_GAIN = Number(input.value);
        input = document.getElementById("D_GAIN");
        rocket.D_GAIN = Number(input.value);
        input = document.getElementById("INT_SATURATION");
        rocket.INT_SATURATION = Number(input.value);
        input = document.getElementById("POWER");
        rocket.POWER = Number(input.value);
        input = document.getElementById("DEBUG_MODE");
        rocket.DEBUG_MODE = Boolean(input.checked);
        input = document.getElementById("DEBUG_MODE");
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
//# sourceMappingURL=index.js.map