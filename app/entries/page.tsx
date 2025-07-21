import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { Entry } from "@/models/Entry";
import EntryList from "@/components/entries/EntryList";
import { HeaderWithSearch } from "@/components/entries/HeaderWithSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface EntryData {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
}

interface SearchProps {
    searchParams?: {
        page?: string;
        filter?: string;
        q?: string;
    };
}


export default async function Page({ searchParams }: SearchProps) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return <p>Please, Login!</p>;
    }

    const userId = session.user.id;


    const PAGE_SIZE = 15;
    const page = Number(searchParams?.page || "1");
    const query = searchParams?.q?.toLowerCase() || "";

    await connectToDatabase();

    const filter: any = {
        user: userId,
    };

    if (searchParams?.filter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        filter.createdAt = {
            $gte: today,
            $lt: tomorrow,
        };
    }

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { tags: { $elemMatch: { $regex: query, $options: "i" } } },
        ];
    }

    const totalEntries = await Entry.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalEntries / PAGE_SIZE), 1);

    if (page < 1 || page > totalPages) {
        return notFound();
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

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <HeaderWithSearch query={query} />

            <EntryList entries={entries} />

            <div className="flex justify-between items-center mt-8">
                <Button variant="outline" disabled={page === 1}>
                    <Link href={`/entries?page=${page - 1}&q=${query}`}>← Previous</Link>
                </Button>

                <span className="text-muted-foreground text-sm">
                    Page {page} of {totalPages}
                </span>

                <Button variant="outline" disabled={page === totalPages}>
                    <Link href={`/entries?page=${page + 1}&q=${query}`}>Next →</Link>
                </Button>
            </div>
        </div>
    );
}