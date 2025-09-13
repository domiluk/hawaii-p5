function toggleMute(): void {
    muted = !muted
    if (muted) {
        dray.setVolume(0)
        spring.setVolume(0)
        mainSample.setVolume(0)
    } else {
        dray.setVolume(sfxVol / 300)
        spring.setVolume(sfxVol / 300)
        mainSample.setVolume(musicVol / 300)
    }
}

function menuButtons(): void {
    const playLabel: TextLabel = {
        text: "Play",
        size: 0.9 * 40,
        xOffset: 47,
        yOffset: 12,
    }
    if (textButton(playLabel, 162, 600, 96, 60)) {
        sceneManager.switchTo("play menu")
    }

    const leaderboardLabel: TextLabel = {
        text: "Leaderboard",
        size: 0.9 * 25,
        xOffset: 48,
        yOffset: 17,
    }
    if (textButton(leaderboardLabel, 312, 597, 96, 57)) {
        sceneManager.switchTo("leaderboard")
    }

    const optionsLabel: TextLabel = {
        text: "Options",
        size: 0.9 * 35,
        xOffset: 48,
        yOffset: 13,
    }
    if (textButton(optionsLabel, 543, 597, 95, 57)) {
        sceneManager.switchTo("options")
    }

    const creditsLabel: TextLabel = {
        text: "Credits",
        size: 0.9 * 35,
        xOffset: 48,
        yOffset: 12,
    }
    if (textButton(creditsLabel, 664, 601, 95, 57)) {
        sceneManager.switchTo("credits")
    }

    const muteLabel: TextLabel = {
        text: "\ueee8", // "\uf028", // "\udb81\udf5a", // "\udb81\udf5b", 
        size: 0.9 * 25,
        xOffset: 25,
        yOffset: 7,
        rotate: 15,
        font: symbols,
    }
    if (muted) {
        // Show muted icon
        muteLabel.text = "\ueee8"
    } else {
        // Show unmuted icon
        muteLabel.text = "\uf028"
    }
    if (textButton(muteLabel, 883, 678, 45, 33)) {
        toggleMute()
    }

    // logo
    // TODO: should this be a label?
    textFont(airstream)
    noStroke()
    fill(0)
    textSize(0.9 * 75)
    text("Hawaii", 512, 100)
}