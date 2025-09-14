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
    const parsed = JSON.parse(stored)
    // Add type guard
    if (isOptionsEntry(parsed)) {
        return parsed
    }
    return null
}

function isOptionsEntry(obj: any): obj is OptionsEntry {
    return typeof obj === 'object' &&
        typeof obj.name1 === 'string' &&
        typeof obj.name2 === 'string' &&
        typeof obj.lapsIndex === 'number' &&
        typeof obj.sfxIndex === 'number' &&
        typeof obj.musicIndex === 'number'
}