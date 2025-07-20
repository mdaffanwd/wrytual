'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Spinner from "@/components/ui/spinner"
import { EditEntryForm } from "@/components/entries/EditEntryForm"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
    const { id } = useParams()
    const router = useRouter()
    const [entry, setEntry] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/entries/${id}`)
                console.log(id)
                if (!res.ok) throw new Error("Entry not found")
                const data = await res.json()
                setEntry(data)
            } catch (err) {
                console.error("Failed to fetch entry:", err)
                router.push("/entries")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchEntry()
    }, [id, router])

    if (loading) return <Spinner />
    if (!entry) return <p className="text-red-500">Entry not found</p>

    return (
        <div className="flex justify-center items-center min-h-screen px-4 bg-muted">
            <Card className="w-full max-w-2xl py-4">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold mb-4">Edit Entry</h1>
                    <EditEntryForm entry={entry} isEditing />
                </CardContent>
            </Card>

        </div>
    )
}
