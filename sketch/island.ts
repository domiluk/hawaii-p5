type Point = { x: number, y: number }

class Island {
    points: Point[] = []
    load(lines: string[]): void {
        for (let line of lines) {
            const [x, y] = line.split(" ").map(number => parseInt(number))
            this.points.push({ x, y })
        }
    }

    draw(camleft: number, camup: number): void {
        // draw lines between the points and circles at the points
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i]
            const p2 = i + 1 == this.points.length ? this.points[0] : this.points[i + 1]
            stroke(0)
            line(p1.x - camleft, p1.y - camup, p2.x - camleft, p2.y - camup)
        }
        for (let point of this.points) {
            ellipse(point.x - camleft, point.y - camup, 5, 5)
        }
    }
}