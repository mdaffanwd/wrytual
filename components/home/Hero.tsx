import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="text-center max-w-lg mx-auto pt-20">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                    Wrytual
                </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                Track what you learn. Stay consistent. <br /> Build your dev brain.
            </p>
            <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
                <Button asChild size="lg" className="cursor-pointer w-full sm:basis-2/5">
                    <Link href="/get-started">
                        Get Started
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="cursor-pointer w-full sm:basis-2/5">
                    <Link href={'/login'}>
                        Login
                    </Link>
                </Button>
            </div >
        </section >
    );
}
