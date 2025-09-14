type LeaderboardEntry = {
    name: string,
    lapTime: number,
}

const LEADERBOARD_KEY = "hawaii-leaderboard-v1"
const MAX_ENTRIES = 8

function saveToLeaderboard(name: string, lapTime: number): void {
    const currentBoard = getLeaderboard()
    currentBoard.push({ name, lapTime })

    // sort by time ascending
    currentBoard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => a.lapTime - b.lapTime)

    // keep only the top entries
    const topEntries = currentBoard.slice(0, MAX_ENTRIES)

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries))
}

function getLeaderboard(): LeaderboardEntry[] {
    const stored = localStorage.getItem(LEADERBOARD_KEY)
    if (!stored) return []

    try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.every(isLeaderboardEntry)) {
            return parsed
        }
        return []
    } catch (e) {
        console.error('Failed to parse leaderboard:', e)
        return []
    }
}

function isLeaderboardEntry(obj: any): obj is LeaderboardEntry {
    return typeof obj === 'object' &&
        obj != null &&
        typeof obj.name === 'string' &&
        typeof obj.lapTime === 'number'
}