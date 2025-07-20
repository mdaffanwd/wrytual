'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, redirect } from "next/navigation"

// 🧩 Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { TagList } from "@/components/dashboard/TagList"
import { SearchBar } from "@/components/dashboard/SearchBar"
import { RecentEntries } from "@/components/dashboard/RecentEntries"
import Spinner from "@/components/ui/spinner"

// 📊 Stats Components
import { TodayStats } from "@/components/dashboard/stats/TodayStats"
import { StreakStats } from "@/components/dashboard/stats/StreakStats"
import { InsightsStats } from "@/components/dashboard/stats/InsightsStats"

export const runtime = 'nodejs'

export default function Page() {
    const { data: session, status } = useSession()

    const [search, setSearch] = useState("")
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)

    // 📥 Fetch entries when authenticated
    useEffect(() => {
        if (status === "authenticated") {
            fetchEntries()
        }
    }, [status])

    const fetchEntries = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/entries")
            const data = await res.json()

            // 🧹 Format entries for consistency
            const formatted = data.map((entry: any) => ({
                id: entry._id,
                date: new Date(entry.createdAt).toISOString().split("T")[0],
                title: entry.title,
                tags: entry.tags || [],
                description: entry.description,
                createdAt: entry.createdAt,
            }))

            setEntries(formatted)
        } catch (error) {
            console.error("Failed to fetch entries:", error)
        } finally {
            setLoading(false)
        }
    }

    // 📆 Extract valid entry dates (for streaks)
    const entryDates = entries
        .map((e: any) => {
            const date = new Date(e.createdAt)
            return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]
        })
        .filter((d): d is string => d !== null)

    // 🏷️ Unique tags from all entries
    const tags = Array.from(new Set(entries.flatMap((e: any) => e.tags || [])))

    // ⏳ Loading or redirecting
    if (status === "loading") return <Spinner />
    if (!session) redirect("/login")

    return (
        <div className="p-6 space-y-6 mx-auto max-w-6xl">
            <DashboardHeader />

            {/* 📊 Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TodayStats entries={entries} />
                <StreakStats entryDates={entryDates} />
                <InsightsStats entries={entries} />
            </div>

            {/* 🏷️ Tag List */}
            <TagList tags={tags} />

            {/* 🔍 Search + 🕘 Recent Entries */}
            <div>
                <SearchBar search={search} setSearch={setSearch} />
                <RecentEntries entries={entries} search={search} refetch={fetchEntries} />
            </div>
        </div>
    )
}
