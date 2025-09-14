type OptionsEntry = {
    name1: string,
    name2: string,
    lapsIndex: number,
    sfxIndex: number,
    musicIndex: number,
}

const OPTIONS_KEY = "hawaii-options-v1"

function saveOptions(): void {
    const options: OptionsEntry = {
        name1: player1textBox.input,
        name2: player2textBox.input,
        lapsIndex,
        sfxIndex,
        musicIndex
    }
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options))
}

function getOptions(): OptionsEntry | null {
    const stored = localStorage.getItem(OPTIONS_KEY)
    if (!stored) return null
    return JSON.parse(stored)
}