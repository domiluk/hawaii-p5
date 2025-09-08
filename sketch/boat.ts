class Boat {
    x: number
    y: number
    vel: number
    rot: number
    round: number
    cp_one: boolean
    cp_two: boolean
    cp_three: boolean
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
        g.image(this.bmp, -this.bmp.width / 2, -this.bmp.height / 2)
        g.pop()
    }

    update(): void {
        const gx: number = 0
        const gy: number = 0

        // checkni naraz do ostrova
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 0) {
            // this.vel *= 0.75
            // this.vel *= -1
            this.rot += 180
        }

        // checkni naraz do checkpointov
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 64) {
            this.cp_one = true
        }
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 128) {
            this.cp_two = true
        }
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 32) {
            this.cp_three = true
        }

        // checkni naraz do finishlinu
        if (red(getpixel(alpha_ostrov, this.x + gx, this.y + gy)) == 192 &&
            this.cp_one && this.cp_two && this.cp_three) {
            this.cp_one = false
            this.cp_two = false
            this.cp_three = false
            this.last_lap_sec = global_sec - this.last_lap_sec
            this.last_lap_min = global_min - this.last_lap_min
            if (this.last_lap_sec < 0) {
                this.last_lap_min--
                this.last_lap_sec = 60 - abs(this.last_lap_sec)
            }
            if (this.last_lap_sec + (this.last_lap_min) * 60 <
                this.best_lap_sec + (this.best_lap_min) * 60) {
                this.best_lap_sec = this.last_lap_sec
                this.best_lap_min = this.last_lap_min
            }
            this.round++
            dray.play()
        }


        // input
        if (keyIsDown(this.controls.up)) {
            this.vel += ACCEL * deltaTime / 1000
        } else {
            this.vel -= SLOWDOWN * deltaTime / 1000
        }

        if (keyIsDown(this.controls.down)) {
            this.vel -= SLOWDOWN * deltaTime / 1000
        }

        if (keyIsDown(this.controls.left)) {
            this.rot -= ROTATE_BY * deltaTime / 1000
        }

        if (keyIsDown(this.controls.right)) {
            this.rot += ROTATE_BY * deltaTime / 1000
        }

        // pohni lodou
        this.vel = constrain(this.vel, 0, MAX_SPEED)
        this.x += cos(this.rot) * this.vel * deltaTime / 1000
        this.y += sin(this.rot) * this.vel * deltaTime / 1000
    }
}