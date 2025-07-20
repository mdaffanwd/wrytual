'use client'

import { EntryCard } from "@/components/entries/EntryCard"
import { useState } from "react"

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

export default function EntryList({ entries: initialEntries }: EntryListProps) {
    const [entries, setEntries] = useState(initialEntries)

    const handleDelete = (id: string) => {
        setEntries(prev => prev.filter(entry => entry._id !== id))
    }

    return (
        <>
            {entries.map(entry => (
                <EntryCard
                    key={entry._id}
                    id={entry._id}
                    title={entry.title}
                    description={entry.description}
                    tags={entry.tags}
                    date={new Date(entry.createdAt).toLocaleDateString("en-CA")}
                    onDelete={() => handleDelete(entry._id)}
                />
            ))}
        </>
    )
}
