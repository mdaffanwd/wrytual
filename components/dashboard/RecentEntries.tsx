import { EntryCard } from "./EntryCard"

interface Entry {
    id: string
    date: string
    title: string
    tags: string[]
    snippet: string
}

interface RecentEntriesProps {
    entries: Entry[]
    search: string
}

export function RecentEntries({ entries, search }: RecentEntriesProps) {
    const filtered = entries.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.snippet.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            {filtered.map(entry => (
                <EntryCard key={entry.id} {...entry} />
            ))}
        </div>
    )
}
