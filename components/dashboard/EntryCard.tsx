import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EntryCardProps {
    id: string
    date: string
    title: string
    snippet: string
    tags: string[]
}

export function EntryCard({ date, title, snippet, tags }: EntryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">{date}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{snippet}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
