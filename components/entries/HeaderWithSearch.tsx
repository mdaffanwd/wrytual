'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";

export function HeaderWithSearch({ query }: { query: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (search) {
                params.set("q", search);
            } else {
                params.delete("q");
            }

            params.set("page", "1"); // Reset to page 1
            router.push(`/entries?${params.toString()}`);
            // router.replace(`/entries?${params.toString()}`);
            router.refresh();
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, router, searchParams]);

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold">Your LearnLog Entries</h1>
            <SearchBar search={search} setSearch={setSearch} />
        </div>
    );
}