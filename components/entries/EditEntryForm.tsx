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
            const url = isEditing && entry?._id
                ? `/api/entries/${entry._id}`
                : `/api/entries`

            const method = isEditing ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
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
                <Input
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full">
                {isEditing ? "Update Entry" : "Create Entry"}
            </Button>
        </form>
    )
}
