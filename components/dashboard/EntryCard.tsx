import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "../ui/button"

interface EntryCardProps {
    id: string
    date: string
    title: string
    description: string
    tags: string[]
}

export function EntryCard({ date, title, description, tags }: EntryCardProps) {
    const [showFull, setShowFull] = useState(false)
    const isLong = description.length > 150

    return (
        <Card>
            <CardHeader>
                <p className="font-medium text-sm ">{date}</p>
                <CardTitle className="text-base font-medium">{title}</CardTitle>
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
                </p>                <div className="mt-2 flex gap-1 flex-wrap">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
