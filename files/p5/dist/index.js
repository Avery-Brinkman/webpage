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
        // rocket.P_GAIN = Number(P_GAIN.value());
        // rocket.I_GAIN = Number(I_GAIN.value());
        // rocket.D_GAIN = Number(D_GAIN.value());
        // rocket.INT_SATURATION = Number(INT_SATURATION.value());
        // rocket.POWER = Number(POWER.value());
        // rocket.DEBUG_MODE = Boolean(DEBUG_MODE.value());
        // target.DEBUG_MODE = Boolean(DEBUG_MODE.value());
    }
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        P_GAIN = sketch.createInput("1", "number").position(140, 0).size(40);
        I_GAIN = sketch.createInput("7", "number").position(140, 20).size(40);
        D_GAIN = sketch.createInput("56", "number").position(140, 40).size(40);
        INT_SATURATION = sketch
            .createInput("9", "number")
            .position(140, 60)
            .size(40);
        POWER = sketch.createInput("1000", "number").position(140, 80).size(40);
        DEBUG_MODE = sketch.createCheckbox("Show Vectors", false).position(0, 120);
        sketch.createButton("Reset").position(137, 120).mousePressed(makeP);
        makeP();
        applyInputs();
    };
    sketch.draw = () => {
        sketch.background(67);
        sketch.noStroke();
        sketch.fill(200, 150);
        sketch.rect(0, 0, 190, 143);
        sketch.textSize(15);
        sketch.fill(0);
        sketch.noStroke();
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text("P_GAIN", 0, 0);
        sketch.text("I_GAIN", 0, 20);
        sketch.text("D_GAIN", 0, 40);
        sketch.text("INT_SATURATIONS", 0, 60);
        sketch.text("POWER", 0, 80);
        // applyInputs();
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