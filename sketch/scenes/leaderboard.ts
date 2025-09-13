class LeaderboardScene extends Scene {
    draw(): void {
        image(menu, 0, 0)
        menuButtons()

        textAlign(CENTER, TOP)
        textFont(airstream)

        noStroke()
        fill(0)
        textSize(0.9 * 50)
        text("Leaderboard", 512, 190)
        textSize(0.9 * 35)

        textAlign(LEFT, TOP)
        text("Name", 370, 250)
        textAlign(RIGHT, TOP)
        text("Lap time", 674, 250)

        const entries = getLeaderboard()
        entries.forEach((entry, index) => {
            textAlign(LEFT, TOP)
            text(entry.name, 370, 280 + index * 30)

            textAlign(RIGHT, TOP)
            text(`${index + 1}.`, 350, 280 + index * 30)
            text(formatAsTime(entry.lapTime, true), 674, 280 + index * 30)
        })

        for (let index = entries.length; index < MAX_ENTRIES; index++) {
            textAlign(LEFT, TOP)
            text("--", 370, 280 + index * 30)

            textAlign(RIGHT, TOP)
            text(`${index + 1}.`, 350, 280 + index * 30)
            text("--", 674, 280 + index * 30)
        }
    }
}