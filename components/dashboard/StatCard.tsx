import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type StatCardProps = {
    title: string
    children: React.ReactNode
}

export function StatCard({ title, children }: StatCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
