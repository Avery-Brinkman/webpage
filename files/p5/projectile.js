class Projectile {
  constructor(pos_i, vel_i, acc_i, maxSpeed, target = null) {
    this.pos = pos_i;
    this.vel = vel_i;
    this.acc = acc_i;

    this.maxVel = maxSpeed;

    this.target = target;
    this.isHit = false;

    this.smoke = [];

    this.p = 0;
    this.i = 0;
    this.d = 0;

    this.intStored = createVector(0, 0);

    this.errorLast = this.pos.copy();
    this.posLast = this.pos.copy();
  }

  update() {
    // PID Controller
    if (this.target) {
      // Hit detection
      if (this.pos.dist(this.target.pos) < 10 && !this.isHit) {
        this.isHit = true;
        this.target.isHit = true;
        this.vel.add(this.target.vel);
        this.vel.div(2);
      }

      // Error
      const err = p5.Vector.sub(this.target.pos, this.pos);

      // P term
      this.p = err.copy().mult(float(P_GAIN.value()));

      // I term
      this.intStored.add(err.copy());
      this.intStored.setMag(
        Math.min(
          Math.max(this.intStored.mag(), -1 * float(INT_SATURATION.value())),
          float(INT_SATURATION.value())
        )
      );
      this.i = this.intStored.copy().mult(float(I_GAIN.value()));

      // D term
      this.d = err.copy().sub(this.errorLast);
      this.d.mult(float(D_GAIN.value()));

      this.errorLast.set(err);

      this.acc.set(0, 0);
      this.acc.add(this.p);
      this.acc.add(this.i);
      this.acc.add(this.d);
      this.acc.limit(float(POWER.value()));
    }

    // Smoke
    if (this.target || this.isHit) this.smoke.push(this.pos.copy());
    if (this.smoke.length > 25) {
      this.smoke.shift(25 - this.smoke.length);
    }

    // Hit
    if (this.isHit) {
      if (this.target) {
        this.acc.set(0, 0);
        if (this.pos.y > height - 5) {
          this.pos.set(this.pos.x, height - 5);
          this.vel.mult(0.6, -0.25);
        }
      } else if (this.pos.y > height - 10) {
        this.pos.set(this.pos.x, height - 10);
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
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.mult(-1, 1);
      this.pos.set(this.pos.x < 0 ? 0 : width, this.pos.y);
    }
    if (this.pos.y > height) {
      this.vel.mult(1, -1);
      this.pos.set(this.pos.x, height);
    }
  }

  show() {
    // Smoke trail
    if (this.isHit || this.target) {
      for (let s in this.smoke) {
        this.smoke[s].sub(
          random(-1, 1),
          random(this.vel.mag() < 150 ? 0 : -1, 1)
        );
        translate(this.smoke[s].x, this.smoke[s].y);
        if (this.target) {
          rotate(this.vel.heading() + radians(180));
          translate(20, 0);
        }
        stroke(map(s, 0, this.smoke.length - 1, 60, 50));
        strokeWeight(map(s, 0, this.smoke.length - 1, 5, 20));
        point(0, 0);
        resetMatrix();
      }
    }
    resetMatrix();

    // Draw rocket
    if (this.target) {
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading() + radians(180));

      // Flames
      if (!this.isHit) {
        strokeWeight(25);
        stroke(255, random(10, 30));
        point(25, 0);

        strokeWeight(5);
        stroke(255, 0, 0);
        point(25, 0);

        strokeWeight(7);
        stroke(255, 122, 0);
        point(20, 0);

        strokeWeight(10);
        stroke(255, 255, 0);
        point(15, 0);
      }

      // Body
      noStroke();
      fill(255);
      rect(-5, -5, 20, 10);

      resetMatrix();

      if (DEBUG_MODE.checked()) {
        translate(this.pos.x, this.pos.y);

        // vel line
        stroke(255, 0, 0);
        strokeWeight(1);
        line(0, 0, this.vel.x, this.vel.y);
        strokeWeight(5);
        point(this.vel.x, this.vel.y);

        // p line
        stroke(0, 255, 0);
        strokeWeight(1);
        line(0, 0, this.p.x, this.p.y);
        strokeWeight(5);
        point(this.p.x, this.p.y);

        // i line
        stroke(0, 0, 255);
        strokeWeight(1);
        line(0, 0, this.i.x, this.i.y);
        strokeWeight(5);
        point(this.i.x, this.i.y);

        // d line
        stroke(200, 0, 200);
        strokeWeight(1);
        line(0, 0, this.d.x, this.d.y);
        strokeWeight(5);
        point(this.d.x, this.d.y);

        // acc line
        stroke(255, 255, 0);
        strokeWeight(1);
        line(0, 0, this.acc.x, this.acc.y);
        strokeWeight(5);
        point(this.acc.x, this.acc.y);

        resetMatrix();
      }
    }
    // Projectile
    else {
      if (DEBUG_MODE.checked()) {
        // vel line
        translate(this.pos.x, this.pos.y);
        stroke(255, 0, 0);
        strokeWeight(1);
        line(0, 0, this.vel.x, this.vel.y);
        strokeWeight(5);
        point(this.vel.x, this.vel.y);
        resetMatrix();
      }
      // Explosion
      if (this.isHit) {
        stroke(255, 0, 0, random(150, 255));
        strokeWeight(20);
        point(this.pos);

        stroke(255, 165, 0, random(200, 255));
        strokeWeight(10);
        point(this.pos);

        stroke(255, 255, 0);
        strokeWeight(5);
        point(this.pos);
      }
      // Normal
      else {
        stroke(255);
        strokeWeight(10);
        point(this.pos);
      }
    }
    resetMatrix();
  }
}
