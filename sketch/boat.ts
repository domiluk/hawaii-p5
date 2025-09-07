class Boat {
    x: number
    y: number
    vel: number
    rot: number
    rotate_by: number
    max_speed: number
    accel: number
    slowdown: number
    round: number
    cp_one: number
    cp_two: number
    cp_three: number
    last_lap_sec: number
    best_lap_sec: number
    last_lap_min: number
    best_lap_min: number
    bmp: p5.Image
    controls: {
        up: number,
        down: number,
        left: number,
        right: number,
    }

    draw(g: p5.Graphics | (Window & typeof globalThis), camleft: number, camup: number): void {
        if (!g) {
            g = window
        }
        g.push()
        g.translate(this.x - camleft, this.y - camup)
        g.rotate(this.rot + 90)
        g.image(this.bmp, -this.bmp.width / 2, -this.bmp.height / 2);
        g.pop()
    }

    update(): void {
        // rotates wp (white point) into bc (biela ciarka maybe?)
        // dl_rotate(wp, bc, boat1.rot)
        bc = wp

        // gets the white point from bc (inefficient)
        let rx: number, ry: number, gx: number, gy: number;
        // for (rx = 0; rx < bc.width; rx++) {
        //   for (ry = 0; ry < bc.height; ry++) {
        //     if (getr(getpixel(bc, rx, ry)) == 254) {
        //       gx = rx;
        //       gy = ry;
        //     }
        //   }
        // }
        gx = 0
        gy = 0

        // checkni naraz do ostrova
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 0) {
            this.vel *= -0.75;
        }

        // // checkni naraz do checkpointov
        // if (getr(getpixel(alpha, this.x + gx, this.y + gy)) == 64) {
        //   this.cp_one = 1;
        // }
        // if (getr(getpixel(alpha, this.x + gx, this.y + gy)) == 128) {
        //   this.cp_two = 1;
        // }
        // if (getr(getpixel(alpha, this.x + gx, this.y + gy)) == 32) {
        //   this.cp_three = 1;
        // }

        // // checkni naraz do finishlinu
        // if (getr(getpixel(alpha, this.x + gx, this.y + gy)) == 192 &&
        //   this.cp_one == 1 && this.cp_two == 1 && this.cp_three == 1) {
        //   this.cp_one = 0;
        //   this.cp_two = 0;
        //   this.cp_three = 0;
        //   this.last_lap_sec = global_sec - this.last_lap_sec;
        //   this.last_lap_min = global_min - this.last_lap_min;
        //   if (this.last_lap_sec < 0) {
        //     this.last_lap_min--;
        //     this.last_lap_sec = 60 - abs(this.last_lap_sec);
        //   }
        //   if (this.last_lap_sec + (this.last_lap_min) * 60 <
        //     this.best_lap_sec + (this.best_lap_min) * 60) {
        //     this.best_lap_sec = this.last_lap_sec;
        //     this.best_lap_min = this.last_lap_min;
        //   }
        //   this.round++;
        //   play_sample(dray, 255, 128, 1000, NULL);
        // }

        // pohni lodou
        this.x += cos(this.rot) * this.vel;
        this.y += sin(this.rot) * this.vel;

        // input
        if (keyIsDown(this.controls.up)) {
            if (this.vel < this.max_speed) {
                this.vel += this.accel;
            }
        } else {
            if (keyIsDown(this.controls.down)) {
                if (this.vel > this.slowdown)
                    this.vel -= this.slowdown;
                if (this.vel < -this.slowdown)
                    this.vel += this.slowdown;
            }

            if (this.vel > this.slowdown)
                this.vel -= this.slowdown;
            if (this.vel < -this.slowdown)
                this.vel += this.slowdown;
        }

        if (keyIsDown(this.controls.left)) {
            this.rot -= this.rotate_by;
        }

        if (keyIsDown(this.controls.right)) {
            this.rot += this.rotate_by;
        }
    }
}