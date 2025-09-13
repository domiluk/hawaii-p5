class CreditsScene extends Scene {
    draw(): void {
        image(menu, 0, 0)
        menuButtons()

        textAlign(CENTER, TOP)
        textFont(airstream)

        noStroke()
        fill(0)
        textSize(0.9 * 35)
        text("Original Game Code By", 206, 417)
        text("Graphics & Web Remake By", 800, 417)

        textSize(0.9 * 70)
        text("Daniel Lovásko", 206, 437)
        text("Dominik Lukác", 800, 437)
        text("ˇ", 946, 445)

        // TODO: thanks to majo and mindek
    }
}