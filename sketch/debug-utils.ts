let debug = false

const DT_HISTORY_LENGTH = 400
const dtHistory: number[] = []
let dtHistoryIndex = 0

function toggleDebug(): void {
    debug = !debug
}

function drawMouseDebugInfo(): void {
    textSize(16)
    textAlign(LEFT, TOP)
    noStroke()
    fill(0)
    text(mouseX + " : " + mouseY, mouseX + 5, mouseY - 15)
    if (sceneManager.getCurrentSceneName() == "game" && gameMode == Mode.SINGLEPLAYER) {
        text(floor(mouseX + camleft1) + " : " + floor(mouseY + camup1), mouseX + 5, mouseY - 35)
    }
    text("FPS: " + floor(frameRate()), mouseX + 5, mouseY - 55)
    stroke(0)
    line(mouseX - 10, mouseY, mouseX + 10, mouseY)
    line(mouseX, mouseY - 10, mouseX, mouseY + 10)
}

function drawDeltaTimeHistoryBar(): void {
    dtHistory[dtHistoryIndex] = Math.round(deltaTime)

    for (let i = 0; i < dtHistory.length; i++) {
        stroke(0)
        let diffFromCurrent = dtHistoryIndex - i
        // Fix for wrapped around values
        if (diffFromCurrent < 0) {
            diffFromCurrent += DT_HISTORY_LENGTH
        }
        if (diffFromCurrent > DT_HISTORY_LENGTH - 255) {
            stroke(0, 255 - (diffFromCurrent - DT_HISTORY_LENGTH + 255))
        }
        const x = 1024 - DT_HISTORY_LENGTH - 10 + i
        line(x, 100 - dtHistory[i], x, 100)
    }

    dtHistoryIndex = (dtHistoryIndex + 1) % DT_HISTORY_LENGTH
}
