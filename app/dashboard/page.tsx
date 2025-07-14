
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"

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
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Link href="/entries/new">
                    <Button>+ New Entry</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No entry yet. Start writing!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>4 days in a row 🔥</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside">
                            <li>27 logs total</li>
                            <li>Top tag: TypeScript</li>
                            <li>Longest streak: 7 days</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Recent Entries</h2>
                    <Input
                        className="w-60"
                        placeholder="Search logs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {mockEntries
                        .filter(e =>
                            e.title.toLowerCase().includes(search.toLowerCase()) ||
                            e.snippet.toLowerCase().includes(search.toLowerCase())
                        )
                        .map(entry => (
                            <Card key={entry.id}>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">{entry.date}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold">{entry.title}</p>
                                    <p className="text-sm text-muted-foreground">{entry.snippet}</p>
                                    <div className="mt-2 flex gap-1 flex-wrap">
                                        {entry.tags.map(tag => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    )
}
