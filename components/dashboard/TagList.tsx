import { Badge } from "@/components/ui/badge"

interface TagListProps {
    tags: string[]
}

export function TagList({ tags }: TagListProps) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
            </div>
        </div>
    )
}
