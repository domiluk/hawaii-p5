/// <reference path="../p5-gamedev-framework/scene-manager.ts" />

class GameScene extends Scene {
    override update(): void {
        if (!isPaused) {
            // win conditions
            if (boat1.round == nLaps || boat2.round == nLaps) {
                sceneManager.switchTo("game over")

                if (boat1.round == nLaps) {
                    saveToLeaderboard(player1textBox.input || "Player 1", boat1.bestLapTime)
                } else {
                    saveToLeaderboard(player2textBox.input || "Player 2", boat2.bestLapTime)
                }
            }

            // update timer
            raceTime += deltaTime / 1000

            // check boat collisions
            boat1.collideWith(boat2)

            // check island collisions
            topLeftIsland.collideWith(boat1)
            topLeftIsland.collideWith(boat2)
            bottomRightIsland.collideWith(boat1)
            bottomRightIsland.collideWith(boat2)

            // update boat positions etc
            boat1.update()
            if (gameMode == Mode.MULTIPLAYER) {
                boat2.update()
            } else if (gameMode == Mode.SINGLEPLAYER) {
                // move for AI
                // TODO: implement AI
                boat2.update() // TODO: get rid of this
            }
        }
    }

    override draw(): void {
        if (gameMode == Mode.MULTIPLAYER) {
            // lava polka
            camleft1 = constrain(boat1.x - 256, 0, ostrov.width - 1024 + 512)
            camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768)

            leftBuffer.image(ostrov, -camleft1, -camup1)

            // prava polka
            camleft2 = constrain(boat2.x - 256, 0, ostrov.width - 1024 + 512)
            camup2 = constrain(boat2.y - 384, 0, ostrov.height - 768)

            rightBuffer.image(ostrov, -camleft2, -camup2)

            boat1.draw(leftBuffer, camleft1, camup1)
            boat2.draw(leftBuffer, camleft1, camup1)

            boat1.draw(rightBuffer, camleft2, camup2)
            boat2.draw(rightBuffer, camleft2, camup2)
            image(leftBuffer, 0, 0)
            image(rightBuffer, 512, 0)
            stroke(0)
            line(512, 0, 512, 768)
        }
        else if (gameMode == Mode.SINGLEPLAYER) {
            camleft1 = constrain(boat1.x - 512, 0, ostrov.width - 1024)
            camup1 = constrain(boat1.y - 384, 0, ostrov.height - 768)

            image(ostrov, -camleft1, -camup1);

            boat1.draw(null, camleft1, camup1)
            boat2.draw(null, camleft1, camup1)

            if (debug) {
                topLeftIsland.draw(camleft1, camup1)
                bottomRightIsland.draw(camleft1, camup1)
            }
        }

        this.drawTimerPanels()

        if (isPaused) {
            this.drawPauseMenu()
        }
    }

    override enter(): void {
        resetBoats()
        raceTime = 0
    }

    drawTimerPanels(): void {
        // if boat is behind the panel set it to transparent
        let opacity = 255
        if (gameMode == Mode.SINGLEPLAYER) {
            const x = boat1.x - camleft1
            const y = boat1.y - camup1
            if (x > 512 - 100 && x < 512 + 100 && y < 100) {
                opacity = 127
            }
        } else {
            const x1 = boat1.x - camleft1
            const y1 = boat1.y - camup1
            const x2 = boat2.x - camleft2
            const y2 = boat2.y - camup2
            if ((x1 > 512 - 100 && x1 < 512 && y1 < 100) || (x2 > 0 && x2 < 100 && y2 < 100)) {
                opacity = 127
            }
        }
        tint(255, opacity)
        image(panel, 512 - 100, 0)
        tint(255, 255)

        textAlign(CENTER, TOP)
        noStroke()
        fill(255)
        textSize(0.9 * 75)
        text(formatAsTime(raceTime, false), 512, 0)

        textSize(0.9 * 20)
        text("powered by DL games", 512, 70)

        textAlign(LEFT, TOP)
        textSize(0.9 * 35)
        white_text_with_shadow("Lap " + (boat1.round + 1) + " of " + nLaps, 20, 10)

        white_text_with_shadow("Lap time " + formatAsTime(boat1.lapTime, true), 20, 40)
        if (boat1.bestLapTime == Infinity) {
            white_text_with_shadow("Best lap time --:--", 20, 70)
        } else {
            white_text_with_shadow("Best lap time " + formatAsTime(boat1.bestLapTime, true), 20, 70)
        }

        if (gameMode == Mode.MULTIPLAYER) {
            textAlign(LEFT, TOP)
            textSize(0.9 * 35)
            white_text_with_shadow("Lap " + (boat2.round + 1) + " of " + nLaps, 810, 10)

            white_text_with_shadow("Lap time " + formatAsTime(boat2.lapTime, true), 810, 40)
            if (boat2.bestLapTime == Infinity) {
                white_text_with_shadow("Best lap time --:--", 810, 70)
            } else {
                white_text_with_shadow("Best lap time " + formatAsTime(boat2.bestLapTime, true), 810, 70)
            }
        }
    }

    drawPauseMenu(): void {
        // Semi-transparent overlay
        fill(0, 0, 0, 127)
        rect(0, 0, width, height)

        // Menu text
        textAlign(CENTER, CENTER)
        textFont(airstream)
        fill(255)
        textSize(50)
        text("PAUSED", width / 2, height / 2 - 80)

        // Menu options
        textSize(30)
        const resumeY = height / 2 - 20
        const mainMenuY = height / 2 + 20

        if (mouseY >= resumeY - 15 && mouseY <= resumeY + 15 &&
            mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100) {
            fill("#ff0000")
            if (mouseIsPressed) {
                isPaused = false
            }
        } else {
            fill(255)
        }
        text("Resume", width / 2, resumeY)

        if (mouseY >= mainMenuY - 15 && mouseY <= mainMenuY + 15 &&
            mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100) {
            fill("#ff0000")
            if (mouseIsPressed) {
                isPaused = false
                sceneManager.switchTo("main menu")
            }
        } else {
            fill(255)
        }
        text("Main Menu", width / 2, mainMenuY)
    }

    override keyPressed(): void {
        if (keyCode == ESCAPE) {
            isPaused = !isPaused
            if (isPaused) {
                dray.stop()
                spring.stop()
            }
        }
    }
}

function white_text_with_shadow(str: string, x: number, y: number): void {
    fill(0)
    text(str, x, y)
    fill(255)
    text(str, x - 1, y - 1)
}