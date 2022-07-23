"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
const p5_1 = require("p5");
const p5 = require("../node_modules/p5/lib/p5");
const TIME_SCALE = 0.03;
class Projectile {
    constructor(pos_i, vel_i, acc_i, maxSpeed, target) {
        this.pos = pos_i;
        this.vel = vel_i;
        this.acc = acc_i;
        this.maxVel = maxSpeed;
        this.target = target;
        this.isHit = false;
        this.smoke = [];
        this.p = new p5_1.Vector(0, 0);
        this.i = new p5_1.Vector(0, 0);
        this.d = new p5_1.Vector(0, 0);
        this.intStored = new p5_1.Vector(0, 0);
        this.errorLast = this.pos.copy();
        this.posLast = this.pos.copy();
        this.DEBUG_MODE = false;
        this.P_GAIN = 1;
        this.I_GAIN = 7;
        this.D_GAIN = 56;
        this.INT_SATURATION = 9;
        this.POWER = 1000;
    }
    update() {
        // PID Controller
        if (this.target) {
            // Hit detection
            if (this.pos.dist(this.target.pos) < 10 && !this.isHit) {
                this.isHit = true;
                this.target.isHit = true;
                // fill(255, 20);
                // rect(0, 0, this.displayWidth, this.displayHeight);
                let momentum_i = this.vel.mag() + this.target.vel.mag();
                let dotVect = new p5.Vector(this.vel.dot(this.target.vel) / this.target.vel.mag(), 0).setHeading(this.target.vel.heading());
                this.vel
                    .add(dotVect)
                    .limit(momentum_i - this.target.vel.mag())
                    .mult(1, 0.75);
                this.target.vel.div(2);
            }
            // Error
            const err = p5_1.Vector.sub(this.target.pos, this.pos);
            // P term
            this.p = err.copy().mult(this.P_GAIN);
            // I term
            this.intStored.add(err.copy());
            this.intStored.setMag(Math.min(Math.max(this.intStored.mag(), -1 * this.INT_SATURATION), this.INT_SATURATION));
            this.i = this.intStored.copy().mult(this.I_GAIN);
            // D term
            this.d = err.copy().sub(this.errorLast);
            this.d.mult(this.D_GAIN);
            this.errorLast.set(err);
            this.acc.set(0, 0);
            this.acc.add(this.p);
            this.acc.add(this.i);
            this.acc.add(this.d);
            this.acc.limit(this.POWER);
        }
        // Smoke
        if (this.target || this.isHit)
            this.smoke.push(this.pos.copy());
        if (this.smoke.length > 25) {
            this.smoke.shift();
        }
        // Hit specific movement
        if (this.isHit) {
            if (this.target) {
                this.acc.set(0, 0);
                if (this.pos.y > this.displayHeight - 5) {
                    this.pos.set(this.pos.x, this.displayHeight - 5);
                    this.vel.mult(0.6, -0.25);
                }
            }
            else if (this.pos.y > this.displayHeight - 10) {
                this.pos.set(this.pos.x, this.displayHeight - 10);
                this.vel.mult(0.75, -0.5);
            }
        }
        // Motion
        this.vel
            .add(this.acc.copy().mult(TIME_SCALE))
            .limit(this.maxVel)
            .add(0, 9.8 * TIME_SCALE);
        this.pos.add(this.vel.copy().mult(TIME_SCALE));
        // Edges
        if (this.pos.x < 0 || this.pos.x > this.displayWidth) {
            this.vel.mult(-1, 1);
            this.pos.set(this.pos.x < 0 ? 0 : this.displayWidth, this.pos.y);
        }
        if (this.pos.y > this.displayHeight) {
            this.vel.mult(1, -1);
            this.pos.set(this.pos.x, this.displayHeight);
        }
    }
    show(canvas) {
        // Smoke trail
        if (this.isHit || this.target) {
            for (const [index, smokeParticle] of this.smoke.entries()) {
                // Add noise
                smokeParticle.sub(p5.random(-1, 1), p5.random(this.vel.mag() < 150 ? 0 : -1, 1));
                canvas.translate(smokeParticle.x, smokeParticle.y);
                if (this.target) {
                    // Draw at bottom of rocket
                    canvas.rotate(this.vel.heading() + p5.radians(180));
                    canvas.translate(15, 0);
                }
                // Rocket before hit
                if (this.target && this.isHit) {
                    // Normal smoke
                    canvas.stroke(p5.map(index, 0, this.smoke.length - 1, 60, 50));
                }
                // Firey smoke
                else {
                    // Red flames to smoke
                    if (index < (7 * this.smoke.length) / 9) {
                        canvas.stroke(p5.lerpColor(p5.color(255, 0, 0), p5.color(60), p5.map(index, (6 * this.smoke.length) / 9, (7 * this.smoke.length) / 9, 1, 0)));
                    }
                    // Orange to red flames
                    else if (index < (8 * this.smoke.length) / 9) {
                        canvas.stroke(p5.lerpColor(p5.color(255, 122, 0), p5.color(255, 0, 0), p5.map(index, (7 * this.smoke.length) / 9, (8 * this.smoke.length) / 9, 1, 0)));
                    }
                    // Yellow to red flames
                    else {
                        canvas.stroke(p5.lerpColor(p5.color(255, 255, 0), p5.color(255, 122, 0), p5.map(index, (8 * this.smoke.length) / 9, this.smoke.length, 1, 0)));
                    }
                }
                canvas.strokeWeight(p5.map(index, 0, this.smoke.length - 1, 5, 20));
                canvas.point(0, 0);
                canvas.resetMatrix();
            }
        }
        canvas.resetMatrix();
        // Draw rocket
        if (this.target) {
            canvas.translate(this.pos.x, this.pos.y);
            canvas.rotate(this.vel.heading() + p5.radians(180));
            // Flames glow
            if (!this.isHit) {
                canvas.strokeWeight(25);
                canvas.stroke(255, p5.random(50, 100));
                canvas.point(20, 0);
            }
            // Body
            canvas.noStroke();
            canvas.fill(255);
            canvas.rect(-5, -5, 20, 10);
            canvas.resetMatrix();
            if (this.DEBUG_MODE) {
                canvas.translate(this.pos.x, this.pos.y);
                // vel line
                canvas.stroke(255, 0, 0);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.vel.x, this.vel.y);
                canvas.strokeWeight(5);
                canvas.point(this.vel.x, this.vel.y);
                // p line
                canvas.stroke(0, 255, 0);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.p.x, this.p.y);
                canvas.strokeWeight(5);
                canvas.point(this.p.x, this.p.y);
                // i line
                canvas.stroke(0, 0, 255);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.i.x, this.i.y);
                canvas.strokeWeight(5);
                canvas.point(this.i.x, this.i.y);
                // d line
                canvas.stroke(200, 0, 200);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.d.x, this.d.y);
                canvas.strokeWeight(5);
                canvas.point(this.d.x, this.d.y);
                // acc line
                canvas.stroke(255, 255, 0);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.acc.x, this.acc.y);
                canvas.strokeWeight(5);
                canvas.point(this.acc.x, this.acc.y);
                canvas.resetMatrix();
            }
        }
        // Projectile
        else {
            if (this.DEBUG_MODE) {
                // vel line
                canvas.translate(this.pos.x, this.pos.y);
                canvas.stroke(255, 0, 0);
                canvas.strokeWeight(1);
                canvas.line(0, 0, this.vel.x, this.vel.y);
                canvas.strokeWeight(5);
                canvas.point(this.vel.x, this.vel.y);
                canvas.resetMatrix();
            }
            if (this.isHit) {
                // Hit
                canvas.stroke(122);
            }
            else {
                // Normal
                canvas.stroke(255);
            }
            canvas.strokeWeight(10);
            canvas.point(this.pos);
        }
        canvas.resetMatrix();
    }
}
exports.Projectile = Projectile;
//# sourceMappingURL=projectile.js.map