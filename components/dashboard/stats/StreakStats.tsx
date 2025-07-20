'use client'

import { StatCard } from "@/components/dashboard/StatCard"
import { calculateStreak } from "@/utils/streak"

export function StreakStats({ entryDates }: { entryDates: string[] }) {
    const { streak, emoji } = calculateStreak(entryDates)

    return (
        <StatCard title="Streak">
            <div className="flex flex-col items-center justify-center mt-2">
                <span className="text-5xl font-bold">{streak}</span>
                <span className="text-3xl">{emoji}</span>
                <p className="text-muted-foreground mt-1 text-sm">
                    {streak === 1 ? '1 day in a row' : `${streak} days in a row`}
                </p>
            </div>
        </StatCard>
    )
}
