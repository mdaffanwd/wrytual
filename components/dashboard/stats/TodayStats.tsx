'use client'

import { useRouter } from "next/navigation"
import { StatCard } from "@/components/dashboard/StatCard"
import { Button } from "@/components/ui/button"

type Entry = {
    id: string
    date: string
    title: string
    description: string
}

export function TodayStats({ entries }: { entries: Entry[] }) {
    const router = useRouter()
    const today = new Date().toISOString().split('T')[0]
    const todaysEntries = entries.filter((entry) => entry.date === today)

    return (
        <StatCard title={`Today's ${todaysEntries.length === 1 ? 'Entry' : 'Entries'} (${todaysEntries.length})`}>
            {todaysEntries.length === 0 ? (
                <p>No entry yet. Start writing!</p>
            ) : (
                <>
                    <ul className="list-disc list-inside space-y-1">
                        {todaysEntries.slice(0, 3).map((entry) => (
                            <li key={entry.id}>
                                <strong>{entry.title}</strong>: {entry.description.slice(0, 50)}...
                            </li>
                        ))}
                    </ul>
                    {todaysEntries.length > 3 && (
                        <button
                            onClick={() => router.push("/entries?filter=today")}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                            View more...
                        </button>
                    )}
                </>
            )}
            <Button
                variant="outline"
                className="mt-4 w-full text-sm"
                onClick={() => router.push("/entries")}
            >
                View All Entries
            </Button>
        </StatCard>
    )
}
