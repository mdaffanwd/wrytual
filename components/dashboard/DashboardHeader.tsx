'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModeToggle } from "../theme-provider/theme-button"

export function DashboardHeader() {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {/* <div className="ml-auto mr-2 sm:mr-5">
                <ModeToggle />
            </div> */}
            <Link href="/entries/new-entry">
                <Button>+ New Entry</Button>
            </Link>
        </div>
    )
}
