interface p5UIEventHandler {
    keyPressed(): void
    keyReleased(): void
    keyTyped(): void
    mouseMoved(): void
    mousePressed(): void
    mouseReleased(): void
}
type UIEventType = keyof p5UIEventHandler

abstract class UIElement implements p5UIEventHandler {
    abstract update(): void
    abstract draw(): void

    keyPressed(): void { }
    keyReleased(): void { }
    keyTyped(): void { }
    mouseMoved(): void { }
    mousePressed(): void { }
    mouseReleased(): void { }
}

class UIManager implements p5UIEventHandler {
    private elementsByGroup = new Map<string, UIElement[]>()
    private activeGroup: string = 'default'

    update(): void {
        const activeElements = this.elementsByGroup.get(this.activeGroup)
        if (!activeElements) return

        activeElements.forEach(element => element.update())
    }

    draw(): void {
        const activeElements = this.elementsByGroup.get(this.activeGroup)
        if (!activeElements) return

        activeElements.forEach(element => element.draw())
    }

    add(element: UIElement, group: string = 'default'): void {
        if (!this.elementsByGroup.has(group)) {
            this.elementsByGroup.set(group, [])
        }
        this.elementsByGroup.get(group).push(element)
    }

    setActiveGroup(group: string): void {
        if (!this.elementsByGroup.has(group)) {
            console.warn(`Group '${group}' doesn't exist`)
            return
        }
        this.activeGroup = group
    }

    handleEvent(eventName: UIEventType): void {
        const activeElements = this.elementsByGroup.get(this.activeGroup)
        if (!activeElements) return

        activeElements.forEach(element => element[eventName]())
    }

    keyPressed(): void {
        this.handleEvent('keyPressed')
    }

    keyReleased(): void {
        this.handleEvent('keyReleased')
    }

    keyTyped(): void {
        this.handleEvent('keyTyped')
    }

    mouseMoved(): void {
        this.handleEvent('mouseMoved')
    }

    mousePressed(): void {
        this.handleEvent('mousePressed')
    }

    mouseReleased(): void {
        this.handleEvent('mouseReleased')
    }
}


/*
class Button extends UIElement {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public label: string,
        public onClick: () => void
    ) { }

    isMouseOver(): boolean {
        return mouseX >= this.x &&
            mouseX < this.x + this.width &&
            mouseY >= this.y &&
            mouseY < this.y + this.height
    }

    override mousePressed(): void {
        if (this.isMouseOver()) {
            this.onClick()
        }
    }

    override update(): void { }
    override draw(): void { }
}
*/


/*
let ui: UIManager;

function setup() {
    ui = new UIManager()
    // Add UI elements...
}

function draw() {
    ui.update()
    ui.draw()
}

function keyPressed() {
    ui.keyPressed()
}

function mousePressed() {
    ui.mousePressed()
}
*/