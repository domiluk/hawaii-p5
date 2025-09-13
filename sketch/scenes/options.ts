class OptionsScene extends Scene {
    override enter(): void {
        uiManager.setActiveGroup("options")
    }

    override exit(): void {
        uiManager.setActiveGroup(null)
    }

    override draw(): void {
        image(menu, 0, 0)
        menuButtons()

        // Left side

        textSize(0.9 * 30)
        textAlign(CENTER, TOP)
        fill("#bb0000")
        stroke(200)
        strokeWeight(2)
        text("Player 1", 190, 230)
        strokeWeight(1)

        textFont(airstream)
        textSize(0.9 * 30)
        noStroke()
        fill(0)
        text("Controlled by Arrows", 190, 260)
        player1textBox.update()
        player1textBox.draw()

        textSize(0.9 * 30)
        textAlign(CENTER, TOP)
        fill("#00bb00")
        stroke(50)
        strokeWeight(2)
        text("Player 2", 190, 340)
        strokeWeight(1)

        textFont(airstream)
        textSize(0.9 * 30)
        noStroke()
        fill(0)
        text("Controlled by WASD", 190, 370)
        player2textBox.update()
        player2textBox.draw()

        // Right side 

        optionsSectionLabel("Game options", 800, 230)

        optionLabel("Laps", 775, 270)
        const lapsChangedToIndex = optionSelector(lapsOptions, lapsIndex, 800, 270, 30)
        if (lapsChangedToIndex != -1) {
            lapsIndex = lapsChangedToIndex
            nLaps = lapsOptions[lapsChangedToIndex]
        }

        // TODO: add AI difficulty settings

        optionsSectionLabel("Settings", 800, 330)

        optionLabel("Sound volume", 775, 370)
        const sfxChangedToIndex = optionSelector(sfxOptions, sfxIndex, 800, 370, 45)
        if (sfxChangedToIndex != -1) {
            sfxIndex = sfxChangedToIndex
            sfxVol = sfxOptions[sfxChangedToIndex]

            if (muted) {
                toggleMute()
            }

            spring.setVolume(sfxVol / 300) // the sfx are so loud we need to divide by more than 100
            dray.setVolume(sfxVol / 300) // the sfx are so loud we need to divide by more than 100
            dray.play()
        }

        optionLabel("Music volume", 775, 400)
        const musicChangedToIndex = optionSelector(musicOptions, musicIndex, 800, 400, 45)
        if (musicChangedToIndex != -1) {
            musicIndex = musicChangedToIndex
            musicVol = musicOptions[musicChangedToIndex]

            if (muted) {
                toggleMute()
            }

            mainSample.setVolume(musicVol / 300) // the music is so loud we need to divide by more than 100
        }

        // optionLabel("Graphics", 775, 430)
        // const gfxOptions = ["original", "enhanced"]
        // const gfxChangedToIndex = optionSelector(gfxOptions, 1, 800, 430, 90)
        // if (gfxChangedToIndex != -1) {}
    }
}