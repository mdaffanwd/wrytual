'use client'

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { TagList } from "@/components/dashboard/TagList"
import { SearchBar } from "@/components/dashboard/SearchBar"
import { RecentEntries } from "@/components/dashboard/RecentEntries"
import Spinner from "@/components/ui/spinner"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"

export const runtime = 'nodejs';

const mockEntries = [
    {
        id: "1",
        date: "2025-07-13",
        title: "Explored Server Actions in Next.js",
        tags: ["Next.js", "TypeScript"],
        description: "Learned how to handle mutations using server actions instead of traditional API routes."
    },
    {
        id: "2",
        date: "2025-07-12",
        title: "Tamed MongoDB Indexing",
        tags: ["MongoDB", "Performance"],
        description: "Created compound indexes to speed up queries by 70%."
    }
]

let tags;

export default function Page() {
    const { data: session, status } = useSession()
    // const router = useRouter()
    const [search, setSearch] = useState("")
    const [entries, setEntries] = useState([])
    // console.log(entries)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/entries")
                .then(res => res.json())

                .then(data => {
                    const entriesWithDescription = data.map((entry: any) => ({
                        id: entry._id,
                        date: new Date(entry.createdAt).toISOString().split('T')[0],
                        title: entry.title,
                        tags: entry.tags || [],
                        description: entry.description
                    }))
                    setEntries(entriesWithDescription)
                }).finally(() => setLoading(false))
        }
    }, [status])

    tags = Array.from(new Set(entries.flatMap((e: any) => e.tags || [])))

    if (status === "loading") return <Spinner />
    if (!session) {
        redirect("/login")
    }

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
                <RecentEntries entries={entries} search={search} />
            </div>
        </div>
    )
}
