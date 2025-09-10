type TextLabel = {
    text: string,
    size: number,
    xOffset?: number,
    yOffset?: number,
    rotate?: number,
    font?: p5.Font,
}

let dl_mouseIsPressed = false

function textLabel(label: TextLabel, x: number, y: number, fillColor = color(0), horizAlign: p5.HORIZ_ALIGN = CENTER, vertAlign: p5.VERT_ALIGN = TOP) {
    noStroke()
    fill(fillColor)
    textAlign(horizAlign, vertAlign)
    textSize(label.size)
    textFont(label.font ?? airstream)

    x = x + (label.xOffset ?? 0)
    y = y + (label.yOffset ?? 0)
    if (label.rotate) {
        push()
        translate(x, y)
        rotate(label.rotate)
        translate(-x, -y)
    }
    text(label.text, x, y)
    if (label.rotate) {
        pop()
    }
}

function textButton(label: TextLabel, x: number, y: number, w: number, h: number, debug = true): boolean {
    let mouseIsPressedInsideButton = false
    let fillColor = 0

    if (mouseX >= x && mouseX < x + w && mouseY >= y && mouseY < y + h) {
        fillColor = 255
        if (dl_mouseIsPressed) {
            mouseIsPressedInsideButton = true
        }
    }

    textLabel(label, x, y, color(fillColor), CENTER, TOP)

    if (debug) {
        stroke(180)
        strokeWeight(1)
        noFill()
        rect(x, y, w, h)
    }

    return mouseIsPressedInsideButton
}

const leftChevronLabel: TextLabel = {
    text: "‹",
    size: 0.9 * 60,
    xOffset: 15,
    yOffset: -13,
}

const rightChevronLabel: TextLabel = {
    text: "›",
    size: 0.9 * 60,
    xOffset: 10,
    yOffset: -13,
}

function leftChevronButton(x: number, y: number): boolean {
    return textButton(leftChevronLabel, x, y, 25, 25)
}

function rightChevronButton(x: number, y: number): boolean {
    return textButton(rightChevronLabel, x, y, 25, 25)
}

function optionSelector(options: (string | number)[], pickedIndex: number, x: number, y: number, gapWidth: number): number {
    let changedTo = -1

    if (leftChevronButton(x, y)) {
        changedTo = constrain(pickedIndex - 1, 0, options.length - 1)
    }

    if (rightChevronButton(x + 25 + gapWidth, y)) {
        changedTo = constrain(pickedIndex + 1, 0, options.length - 1)
    }

    noStroke()
    fill(0)
    textSize(0.9 * 30)
    textAlign(CENTER, TOP)
    text(options[pickedIndex], floor(x + 25 + gapWidth / 2), y)

    return changedTo
}

function optionLabel(text: string, x: number, y: number): void {
    const label: TextLabel = {
        text: text,
        size: 0.9 * 30,
    }
    textLabel(label, x, y, color(0), RIGHT, TOP)
}

function optionsSectionLabel(text: string, x: number, y: number): void {
    const label: TextLabel = {
        text: text,
        size: 0.9 * 30,
    }
    textLabel(label, x, y, color(255), CENTER, TOP)
}

class TextBox {
    label: string
    input: string = "MMMMMMMM"
    maxLen: number
    focused: boolean = false
    highlighted: boolean = false
    cursorVisible: boolean = true
    lastBlinkTime: number = 0
    x: number
    y: number
    w: number
    h: number

    constructor(label: string, maxLen: number, x: number, y: number) {
        this.label = label
        this.maxLen = maxLen
        this.x = x
        this.y = y
        this.w = 0
        this.h = 0.9 * 30
    }

    update(): void {
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

    draw(): void {
        textSize(0.9 * 30)

        const width = textWidth(this.label + " " + this.input)
        this.w = width

        // debug textbox
        stroke(150)
        noFill()
        rect(this.x - width / 2, this.y, width, this.h)

        // Text
        textAlign(CENTER, TOP)
        noStroke()
        fill(this.highlighted || this.focused ? 255 : 0)
        text(this.label + " " + this.input, this.x, this.y)

        // Blink only when focused
        if (this.focused) {
            if (this.cursorVisible) {
                const cursorX = this.x + this.w / 2 + 5
                stroke(255)
                line(cursorX, this.y + 2, cursorX, this.y + this.h - 4)
            }
        }
    }

    keyTyped(): void {
        if (!this.focused) return

        if (/^[ a-zA-Z0-9]$/.test(key) && this.input.length < this.maxLen) {
            this.input += key
            this.resetBlink()
        }
    }

    keyPressed(): void {
        if (!this.focused) return

        if (keyCode === BACKSPACE && this.input.length > 0) {
            this.input = this.input.slice(0, -1)
            this.resetBlink()
        }
    }

    mousePressed(): void {
        const mouseInside =
            mouseX >= this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
            mouseY >= this.y && mouseY < this.y + this.h
        this.focused = mouseInside
        if (this.focused) this.resetBlink()
    }

    mouseMoved(): void {
        const mouseInside =
            mouseX >= this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
            mouseY >= this.y && mouseY < this.y + this.h
        this.highlighted = mouseInside
    }

    resetBlink(): void {
        this.cursorVisible = true
        this.lastBlinkTime = millis()
    }
}