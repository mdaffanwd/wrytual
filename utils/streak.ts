export const calculateStreak = (dates: string[]): { streak: number; emoji: string } => {
    const sortedDates = Array.from(new Set(dates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    let currentDate = new Date()

    for (let date of sortedDates) {
        const entryDate = new Date(date)
        const diff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diff === 0 || diff === 1) {
            streak++
            currentDate.setDate(currentDate.getDate() - 1)
        } else {
            break
        }
    }

    let emoji = '🧊'
    if (streak >= 3) emoji = '🔥'
    if (streak >= 7) emoji = '🚀'
    if (streak >= 14) emoji = '🏆'
    if (streak >= 30) emoji = '🌟'

    return { streak, emoji }
}

export const calculateLongestStreak = (dates: string[]): number => {
    const uniqueSorted = Array.from(new Set(dates)).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    if (uniqueSorted.length < 2) return uniqueSorted.length


    let longest = 0
    let currentStreak = 1

    for (let i = 1; i < uniqueSorted.length; i++) {
        const prev = new Date(uniqueSorted[i - 1])
        const curr = new Date(uniqueSorted[i])
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))

        if (diff === 1) {
            currentStreak++
        } else {
            longest = Math.max(longest, currentStreak)
            currentStreak = 1
        }
    }

    return Math.max(longest, currentStreak)
}
