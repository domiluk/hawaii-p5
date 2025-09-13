function formatAsTime(seconds: number, includeMillis: boolean): string {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    if (includeMillis) {
        if (min == 0) {
            return nf(sec, 1) + "." + nf(ms, 2)
        }
        return nf(min, 1) + ":" + nf(sec, 2) + "." + nf(ms, 2)
    }
    return nf(min, 1) + ":" + nf(sec, 2)
}