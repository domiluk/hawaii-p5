type TextLabel = {
    text: string,
    size: number,
    xOffset?: number,
    yOffset?: number,
    rotate?: number,
    font?: p5.Font,
}

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
        if (mouseIsPressed) {
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
        changedTo = (pickedIndex - 1) % options.length
    }

    if (rightChevronButton(x + 25 + gapWidth, y)) {
        changedTo = (pickedIndex + 1) % options.length
    }

    noStroke()
    fill(0)
    textSize(0.9 * 30)
    textAlign(CENTER, TOP)
    text(options[pickedIndex], floor(x + 25 + gapWidth / 2), y)

    return changedTo
}

function optionLabel(text: string, x: number, y: number): void {
    let label: TextLabel = {
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