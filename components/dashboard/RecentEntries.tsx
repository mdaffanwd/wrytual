import { EntryCard } from "@/components/entries/EntryCard"
import Link from "next/link"
import { Button } from "../ui/button"

interface Entry {
    id: string
    date: string
    title: string
    tags: string[]
    description: string
}

interface RecentEntriesProps {
    entries: Entry[]
    search: string
    refetch?: () => void
}

export function RecentEntries({ entries, search, refetch }: RecentEntriesProps) {
    const filtered = entries.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
    )

    const recent = filtered.slice(0, 4)

    return (
        <div className="space-y-4">
            {recent.length > 0 ? (
                recent.map(entry => (
                    <EntryCard key={entry.id} {...entry} onDelete={refetch} />
                ))
            ) : (
                <p className="text-muted-foreground">No entries found.</p>
            )}

            {filtered.length > 4 && (
                <div className="pt-2 pb-4 text-center">
                    <Link href="/entries">
                        <Button variant="outline" className="text-sm px-6">
                            View all entries →
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}