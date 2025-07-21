import { Input } from "@/components/ui/input"

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
    return (
        <div className="w-full sm:w-60">
            <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}