'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "../ui/button"
import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

interface EntryCardProps {
    id: string
    date: string
    title: string
    description: string
    tags: string[]
    onDelete?: () => void
}

export function EntryCard({ id, date, title, description, tags }: EntryCardProps) {
    const [showFull, setShowFull] = useState(false)
    const isLong = description.length > 150
    const router = useRouter()

    const handleDelete = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this entry?")
        if (!confirmDelete) return

        try {
            const res = await fetch(`/api/entries/${id}`, {
                method: "DELETE"
            })

            if (!res.ok) throw new Error("Failed to delete")

            // onDelete?.() // revalidate the current page entries
            router.refresh();
        } catch {
            // console.error("Delete failed:", err)
            alert("Could not delete entry")
        }
    }

    const handleEdit = () => {
        router.push(`/entries/edit/${id}`)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <p className="font-medium text-sm ">{date}</p>
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 hover:bg-red-500 hover:text-red-900">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400">
                    {showFull || !isLong
                        ? description
                        : description.slice(0, 150)}
                    {isLong && (
                        <a
                            onClick={() => setShowFull(!showFull)}
                            className="text-blue-600 hover:underline ml-1 text-sm cursor-pointer"
                        >
                            {showFull ? "Show Less" : "Read More"}
                        </a>
                    )}
                </p>
                {tags.filter(tag => tag.trim() !== "").length > 0 &&
                    <div className="mt-2 flex gap-1 flex-wrap">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                }
            </CardContent>
        </Card>
    )
}
