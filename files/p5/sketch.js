/// <reference path="./node_modules/@types/p5/global.d.ts"/>
const TIME_SCALE = 0.03;
let target, rocket;

let P_GAIN, I_GAIN, D_GAIN, INT_SATURATION, POWER, DEBUG_MODE;

function makeP() {
  target = new Projectile(
    createVector(width, height),
    createVector(200, 0).setHeading(radians(random(-165, -135))), // 200
    createVector(0, 0),
    500
  );

  rocket = new Projectile(
    createVector(width / 2, height),
    createVector(0, 0),
    createVector(0, 0),
    500
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  makeP();

  P_GAIN = createInput(1, 'number').position(140, 0).size(40);
  I_GAIN = createInput(7, 'number').position(140, 20).size(40);
  D_GAIN = createInput(56, 'number').position(140, 40).size(40);
  INT_SATURATION = createInput(9, 'number').position(140, 60).size(40);
  POWER = createInput(1000, 'number').position(140, 80).size(40);
  DEBUG_MODE = createCheckbox('Show Vectors', false).position(0, 120);
  createButton('Reset').position(137, 120).mousePressed(makeP);
}

function draw() {
  background(67);
  noStroke();
  fill(200, 150);
  rect(0, 0, 190, 143);

  textSize(15);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text('P_GAIN', 0, 0);
  text('I_GAIN', 0, 20);
  text('D_GAIN', 0, 40);
  text('INT_SATURATIONS', 0, 60);
  text('POWER', 0, 80);

  target.update();
  rocket.update();

  target.show();
  rocket.show();
}

function mouseClicked() {
  if (mouseX > 190 && mouseY > 143) {
    rocket.target = target;
  }
}
