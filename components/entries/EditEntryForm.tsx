'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Entry {
    _id?: string
    title: string
    description: string
    tags: string[]
}

export function EditEntryForm({ entry, isEditing = false }: { entry?: Entry; isEditing?: boolean }) {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")

    useEffect(() => {
        if (entry) {
            setTitle(entry.title || "")
            setDescription(entry.description || "")
            setTags((entry.tags || []).join(", "))
        }
    }, [entry])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            title,
            description,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        }

        try {
            // const url = isEditing && entry?._id
            //     ? `/api/entries/${entry._id}`
            //     : `/api/entries/new-entry`

            const res = await fetch(`/api/entries/${entry?._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to submit")

            router.push("/entries")
        } catch (err) {
            console.error("Error submitting entry:", err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">What did you learn?</Label>
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                >
                    {/* {isEditing ? "Update Entry" : "Create Entry"} */}
                    Update Entry
                </Button>
            </div>
        </form>
    )
}
