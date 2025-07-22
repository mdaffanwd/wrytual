
import { EntryCard } from "@/components/entries/EntryCard"

interface Entry {
    _id: string
    title: string
    description: string
    tags: string[]
    createdAt: string
}

interface EntryListProps {
    entries: Entry[]
}

export default function EntryList({ entries }: EntryListProps) {

    if (!entries.length) {
        return (
            <p className="text-center text-muted-foreground text-sm mt-6">
                No entries found. Try a different search or create a new entry!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map(entry => (
                <EntryCard
                    key={entry._id}
                    id={entry._id}
                    title={entry.title}
                    description={entry.description}
                    tags={entry.tags}
                    date={new Date(entry.createdAt).toLocaleDateString("en-CA")}
                />
            ))}
        </div>
    );
}
