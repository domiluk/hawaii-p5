/// <reference path="../p5-gamedev-framework/ui-manager.ts" />

class TextBox extends UIElement {
    width: number = 0
    height: number = 0
    input: string = "MMMMMMMM"
    focused: boolean = false
    highlighted: boolean = false
    cursorVisible: boolean = true
    lastBlinkTime: number = 0

    constructor(
        public label: string,
        public maxLen: number,
        public x: number,
        public y: number,
    ) {
        super()
    }

    override update(): void {
        if (this.focused) {
            const currentTime = millis()
            if (currentTime - this.lastBlinkTime > 500) {
                this.cursorVisible = !this.cursorVisible
                this.lastBlinkTime = currentTime
            }
            if (this.highlighted) {
                this.highlighted = false
            }
        }
    }

    override draw(): void {
        textSize(0.9 * 30)

        this.width = textWidth(this.label + " " + this.input)
        this.height = 0.9 * 30

        // debug textbox
        stroke(150)
        noFill()
        rect(this.x - this.width / 2, this.y, this.width, this.height)

        // Text
        textAlign(CENTER, TOP)
        noStroke()
        fill(this.highlighted || this.focused ? 255 : 0)
        text(this.label + " " + this.input, this.x, this.y)

        // Blink only when focused
        if (this.focused) {
            if (this.cursorVisible) {
                const cursorX = this.x + this.width / 2 + 5
                stroke(255)
                line(cursorX, this.y + 2, cursorX, this.y + this.height - 4)
            }
        }
    }

    override keyTyped(): void {
        if (!this.focused) return

        if (/^[ a-zA-Z0-9]$/.test(key) && this.input.length < this.maxLen) {
            this.input += key
            this.resetBlink()
        }
    }

    override keyPressed(): void {
        if (!this.focused) return

        if (keyCode === BACKSPACE && this.input.length > 0) {
            this.input = this.input.slice(0, -1)
            this.resetBlink()
        }
    }

    override mousePressed(): void {
        const mouseInside =
            mouseX >= this.x - this.width / 2 && mouseX < this.x + this.width / 2 &&
            mouseY >= this.y && mouseY < this.y + this.height
        this.focused = mouseInside
        if (this.focused) this.resetBlink()
    }

    override mouseMoved(): void {
        const mouseInside =
            mouseX >= this.x - this.width / 2 && mouseX < this.x + this.width / 2 &&
            mouseY >= this.y && mouseY < this.y + this.height
        this.highlighted = mouseInside
    }

    resetBlink(): void {
        this.cursorVisible = true
        this.lastBlinkTime = millis()
    }
}