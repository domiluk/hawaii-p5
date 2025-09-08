class Boat {
    x: number
    y: number
    vel: number
    rot: number
    round: number
    cp_one: boolean
    cp_two: boolean
    cp_three: boolean
    lap_time: number
    best_lap_time: number
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

        const px = getpixel(alpha_ostrov, this.x + gx, this.y + gy)
        const redValue = red(px)

        // checkni naraz do ostrova
        if (redValue == 0) {
            // this.vel *= 0.75
            // this.vel *= -1
            this.rot += 180
        }

        // checkni naraz do checkpointov
        if (redValue == 64) {
            this.cp_one = true
        }
        if (redValue == 128) {
            this.cp_two = true
        }
        if (redValue == 32) {
            this.cp_three = true
        }

        // checkni naraz do finishlinu
        if (red(px) == 192 &&
            this.cp_one && this.cp_two && this.cp_three) {
            this.cp_one = false
            this.cp_two = false
            this.cp_three = false
            if (this.lap_time < this.best_lap_time) {
                this.best_lap_time = this.lap_time
            }
            this.lap_time = 0
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

        // pohni timer
        this.lap_time += deltaTime / 1000
    }
}

function resetBoats(): void {
    boat1.x = 960
    boat1.y = 1130
    boat1.round = 0
    boat1.cp_one = false
    boat1.cp_two = false
    boat1.cp_three = false
    boat1.vel = 0
    boat1.rot = -54
    boat1.lap_time = 0
    boat1.best_lap_time = Infinity
    // boat1.speed = 5.0
    boat1.controls = {
        up: UP_ARROW,
        down: DOWN_ARROW,
        left: LEFT_ARROW,
        right: RIGHT_ARROW
    }

    boat2.x = 1060
    boat2.y = 1200
    boat2.round = 0
    boat2.cp_one = false
    boat2.cp_two = false
    boat2.cp_three = false
    boat2.vel = 0
    boat2.rot = -54
    boat2.lap_time = 0
    boat2.best_lap_time = Infinity
    boat2.controls = {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    }
}