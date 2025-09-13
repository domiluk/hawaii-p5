class GameOverScene extends Scene {
    draw(): void {
        // return to menu
        if (keyIsPressed && keyCode == ESCAPE) {
            sceneManager.switchTo("main menu")
        }

        background(0)

        textAlign(CENTER, TOP)
        noStroke()
        fill(255)
        textSize(0.9 * 75)
        text("The winner is...!", 512, 384)

        textSize(0.9 * 80)
        if (boat1.round == nLaps) {
            text("Player no.1", 512, 434)
        }
        else {
            text("Player no.2", 512, 434)
        }
    }
}