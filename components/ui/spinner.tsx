import { Loader2 } from "lucide-react"

export default function Spinner({ size = 24 }: { size?: number }) {
    return (
        <div className="flex items-center justify-center">
            <Loader2
                className="animate-spin text-primary"
                size={size}
                strokeWidth={2}
            />
        </div>
    )
}
