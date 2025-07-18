// app/entries/page.tsx
// import { EntryCard } from "@/components/entry-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { dbConnect } from "@/lib/db";
// import Entry from "@/models/entry"; // your Mongoose model
import { notFound } from "next/navigation";

interface Entry {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
}

interface Props {
    searchParams?: {
        page?: string;
    };
}

export default async function EntriesPage({ searchParams }: Props) {
    const PAGE_SIZE = 15;
    const page = parseInt(searchParams?.page || "1");

    await dbConnect(); // connect to MongoDB

    const totalEntries = await Entry.countDocuments();
    const totalPages = Math.ceil(totalEntries / PAGE_SIZE);

    if (page < 1 || page > totalPages) {
        return notFound();
    }

    const entries = await Entry.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean();

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Your LearnLog Entries</h1>

            {entries.map((entry) => (
                <EntryCard key={entry._id} entry={entry} />
            ))}

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
