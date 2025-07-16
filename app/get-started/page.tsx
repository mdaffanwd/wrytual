import TryLogForm from "@/components/get-started/TryLogForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <main className="max-w-2xl mx-auto px-4 py-20 space-y-12">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Start capturing your knowledge today</h1>
                <p className="text-muted-foreground text-lg">
                    Try a sample entry — no account needed.
                </p>
            </section>

            <TryLogForm />

            <div className="text-center space-y-4">
                <p className="text-muted-foreground">Ready to save your dev brain for real?</p>
                <Button asChild size="lg">
                    <Link href={'/signup'}>Create Account</Link>
                </Button>
                <div>
                    <Link href="/" className="text-sm underline text-muted-foreground hover:text-primary">
                        Skip and explore Wrytual
                    </Link>
                </div>
            </div>
        </main>
    );
}
