'use client'

import { StatCard } from "@/components/dashboard/StatCard"
import { calculateLongestStreak } from "@/utils/streak"

type Entry = {
    tags: string[]
    createdAt: string
}

export function InsightsStats({ entries }: { entries: Entry[] }) {
    const entryDates = entries
        .map((e) => {
            const date = new Date(e.createdAt)
            return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]
        })
        .filter((d): d is string => d !== null)

    const longestStreak = calculateLongestStreak(entryDates)

    const tagFrequency: Record<string, number> = {}
    entries.forEach((entry) => {
        for (const tag of entry.tags || []) {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
        }
    })

    const topTag = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return (
        <StatCard title="Insights">
            <ul className="list-disc list-inside">
                <li>{entries.length} logs total</li>
                <li>Top tag: {topTag}</li>
                <li>Longest streak: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}</li>
            </ul>
        </StatCard>
    )
}
