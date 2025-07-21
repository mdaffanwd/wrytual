import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { Entry } from "@/models/Entry";
import EntryList from "@/components/entries/EntryList";
import { ArrowLeft } from "lucide-react";



interface EntryData {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
}

interface SearchProps {
    searchParams?: Promise<{
        page?: string;
        filter?: string;
    }>;
}

export default async function Page({ searchParams }: SearchProps) {
    const PAGE_SIZE = 15;
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page || "1");

    await connectToDatabase();

    const totalEntries = await Entry.countDocuments();
    const totalPages = Math.max(Math.ceil(totalEntries / PAGE_SIZE), 1);

    if (page < 1 || page > totalPages) {
        return notFound();
    }

    const filter: any = {};

    if (resolvedSearchParams?.filter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        filter.createdAt = {
            $gte: today,
            $lt: tomorrow,
        };
    }

    const entriesRaw = await Entry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean();

    const entries: EntryData[] = entriesRaw.map((entry) => ({
        _id: (entry._id as any).toString(),
        title: entry.title,
        description: entry.description,
        tags: entry.tags,
        createdAt: entry.createdAt.toISOString(),
    }));
    console.log(entries)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
             <Button>
                    <Link href="/dashboard">
                     {/* <svg xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" 
                      stroke-width="2" stroke-linecap="round" 
                      stroke-linejoin="round" 
                      class="lucide lucide-arrow-left-icon lucide-arrow-left">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/></svg>
                    // */}
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                </Button>
            <h1 className="text-3xl font-bold mb-6">Your LearnLog Entries</h1>

            <EntryList entries={entries} />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8">
                <Button variant="outline" disabled={page === 1}>
                    <Link href={`/entries?page=${page - 1}`}>← Previous</Link>
                </Button>

                <span className="text-muted-foreground text-sm">
                    Page {page} of {totalPages}
                </span>
               
                <Button variant="outline" disabled={page === totalPages}>
                    <Link href={`/entries?page=${page + 1}`}>Next →</Link>
                </Button>
                
            </div>
        </div>
    );
}
