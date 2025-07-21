'use client'

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function DashboardHeader() {
    const { data: session } = useSession()
    // console.log(session?.user.name)
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Left side: Greeting + Heading */}
            <div>
                <p className="text-sm text-muted-foreground">Hi, {session?.user.name || "there"} 👋</p>
                <h1 className="text-2xl font-bold leading-tight">Dashboard</h1>
            </div>

            {/* Right side: New Entry Button */}
            <Link href="/entries/new-entry" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">+ New Entry</Button>
            </Link>
        </div>

    )
}
