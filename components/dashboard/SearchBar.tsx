import { Input } from "@/components/ui/input"

interface SearchBarProps {
    search: string
    setSearch: (value: string) => void
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Recent Entries</h2>
            <Input
                className="w-60"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    )
}
