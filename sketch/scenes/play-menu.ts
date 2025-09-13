class PlayMenuScene extends Scene {
    draw(): void {
        image(menu, 0, 0)
        menuButtons()

        const singleplayerLabel: TextLabel = {
            text: "Singleplayer",
            size: 0.9 * 60,
            xOffset: 106,
            yOffset: -3,
        }
        if (textButton(singleplayerLabel, 100, 360, 210, 40)) {
            gameMode = Mode.SINGLEPLAYER
            sceneManager.switchTo("game")
        }

        const multiplayerLabel: TextLabel = {
            text: "Multiplayer",
            size: 0.9 * 60,
            xOffset: 106,
            yOffset: -3,
        }
        if (textButton(multiplayerLabel, 100, 400, 210, 42)) {
            gameMode = Mode.MULTIPLAYER
            sceneManager.switchTo("game")
        }
    }
}