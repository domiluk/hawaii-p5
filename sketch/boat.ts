const BOAT_COLLISION_RADIUS = 28

class Boat {
    x: number
    y: number
    speed: number
    rot: number
    round: number
    checkpoint1: boolean
    checkpoint2: boolean
    checkpoint3: boolean
    lapTime: number
    bestLapTime: number
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
        g.stroke(0)
        g.noFill()
        g.circle(0, 0, BOAT_COLLISION_RADIUS * 2)
        g.pop()
    }

    update(): void {
        const gx: number = 0
        const gy: number = 0

        // input
        const accel = ACCEL * deltaTime / 1000
        const slowdown = SLOWDOWN * deltaTime / 1000
        const rotate_by = ROTATE_BY * deltaTime / 1000

        if (keyIsDown(this.controls.up)) {
            this.speed += accel
        } else {
            this.speed -= slowdown
        }

        if (keyIsDown(this.controls.down)) {
            this.speed -= slowdown
        }

        if (keyIsDown(this.controls.left)) {
            this.rot -= rotate_by
        }

        if (keyIsDown(this.controls.right)) {
            this.rot += rotate_by
        }

        // limit speed
        this.speed = constrain(this.speed, 0, MAX_SPEED)

        // check collision with map edges
        const r = BOAT_COLLISION_RADIUS
        let vx = this.speed * cos(this.rot)
        let vy = this.speed * sin(this.rot)
        if ((this.x - r < 0 && vx < 0) || (this.x + r >= ostrov.width && vx > 0)) {
            vx *= -0.75
            this.rot = atan2(vy, vx)
            this.x = constrain(this.x, r, ostrov.width - r - 1)
        }
        if ((this.y - r < 0 && vy < 0) || (this.y + r >= ostrov.height && vy > 0)) {
            vy *= -0.75
            this.rot = atan2(vy, vx)
            this.y = constrain(this.y, r, ostrov.height - r - 1)
        }

        const px = getpixel(alphaOstrov, this.x + gx, this.y + gy)
        const redValue = red(px)

        // checkni naraz do ostrova
        if (redValue == 0) {
            // this.vel *= 0.75
            // this.vel *= -1
            this.rot += 180
        }

        // checkni naraz do checkpointov
        else if (redValue == 64) {
            this.checkpoint1 = true
        }
        else if (redValue == 128) {
            this.checkpoint2 = true
        }
        else if (redValue == 32) {
            this.checkpoint3 = true
        }

        // checkni naraz do finishlinu
        else if (redValue == 192 && this.checkpoint1 && this.checkpoint2 && this.checkpoint3) {
            this.checkpoint1 = false
            this.checkpoint2 = false
            this.checkpoint3 = false
            if (this.lapTime < this.bestLapTime) {
                this.bestLapTime = this.lapTime
            }
            this.lapTime = 0
            this.round++
            dray.play()
        }

        // move the boat
        this.x += this.speed * cos(this.rot) * deltaTime / 1000
        this.y += this.speed * sin(this.rot) * deltaTime / 1000

        // move timer
        this.lapTime += deltaTime / 1000
    }

    collideWith(other: Boat) {
        const distance = dist(this.x, this.y, other.x, other.y)
        if (distance <= BOAT_COLLISION_RADIUS * 2) {
            const impact = p5.Vector.sub(createVector(other.x, other.y), createVector(this.x, this.y))

            // Push the boats out so they don't overlap
            const overlap = BOAT_COLLISION_RADIUS * 2 - distance
            const dir = impact.copy().setMag(0.5 * overlap)
            this.x -= dir.x
            this.y -= dir.y
            other.x += dir.x
            other.y += dir.y
            const newDistance = BOAT_COLLISION_RADIUS * 2
            impact.setMag(newDistance)

            // Calculate new velocities
            const v1x = this.speed * cos(this.rot)
            const v1y = this.speed * sin(this.rot)
            const v2x = other.speed * cos(other.rot)
            const v2y = other.speed * sin(other.rot)
            const vDiff = p5.Vector.sub(createVector(v2x, v2y), createVector(v1x, v1y))

            // This boat
            const num = vDiff.dot(impact)
            const den = newDistance * newDistance
            const deltaV1 = impact.copy().mult(num / den)
            const velocity1 = createVector(v1x, v1y).add(deltaV1)
            this.speed = sqrt(velocity1.x * velocity1.x + velocity1.y * velocity1.y)
            this.rot = atan2(velocity1.y, velocity1.x)

            // Other boat
            const deltaV2 = impact.copy().mult(-num / den)
            const velocity2 = createVector(v2x, v2y).add(deltaV2)
            other.speed = sqrt(velocity2.x * velocity2.x + velocity2.y * velocity2.y)
            other.rot = atan2(velocity2.y, velocity2.x)

            // Play sfx
            spring.play()
        }
    }
}

function resetBoats(): void {
    boat1.x = 960
    boat1.y = 1130
    boat1.round = 0
    boat1.checkpoint1 = false
    boat1.checkpoint2 = false
    boat1.checkpoint3 = false
    boat1.speed = 0
    boat1.rot = -54
    boat1.lapTime = 0
    boat1.bestLapTime = Infinity
    boat1.controls = {
        up: UP_ARROW,
        down: DOWN_ARROW,
        left: LEFT_ARROW,
        right: RIGHT_ARROW
    }

    boat2.x = 1060
    boat2.y = 1200
    boat2.round = 0
    boat2.checkpoint1 = false
    boat2.checkpoint2 = false
    boat2.checkpoint3 = false
    boat2.speed = 0
    boat2.rot = -54
    boat2.lapTime = 0
    boat2.bestLapTime = Infinity
    boat2.controls = {
        up: 87,
        down: 83,
        left: 65,
        right: 68
    }
}