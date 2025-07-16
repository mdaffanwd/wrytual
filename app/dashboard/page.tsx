'use client'

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { TagList } from "@/components/dashboard/TagList"
import { SearchBar } from "@/components/dashboard/SearchBar"
import { RecentEntries } from "@/components/dashboard/RecentEntries"

const mockEntries = [
    {
        id: "1",
        date: "2025-07-13",
        title: "Explored Server Actions in Next.js",
        tags: ["Next.js", "TypeScript"],
        snippet: "Learned how to handle mutations using server actions instead of traditional API routes."
    },
    {
        id: "2",
        date: "2025-07-12",
        title: "Tamed MongoDB Indexing",
        tags: ["MongoDB", "Performance"],
        snippet: "Created compound indexes to speed up queries by 70%."
    }
]

const tags = ["Next.js", "TypeScript", "MongoDB", "Performance"]

export default function Dashboard() {
    const [search, setSearch] = useState("")

    return (
        <div className="p-6 space-y-6 mx-auto max-w-6xl">
            <DashboardHeader />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Today's Entry">
                    <p>No entry yet. Start writing!</p>
                </StatCard>
                <StatCard title="Streak">
                    <p>4 days in a row 🔥</p>
                </StatCard>
                <StatCard title="Insights">
                    <ul className="list-disc list-inside">
                        <li>27 logs total</li>
                        <li>Top tag: TypeScript</li>
                        <li>Longest streak: 7 days</li>
                    </ul>
                </StatCard>
            </div>

            <TagList tags={tags} />

            <div>
                <SearchBar search={search} setSearch={setSearch} />
                <RecentEntries entries={mockEntries} search={search} />
            </div>
        </div>
    )
}
