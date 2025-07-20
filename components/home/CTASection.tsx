import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white py-14 px-8 text-center max-w-screen-lg mx-auto shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold">
                Start building your second brain today.
            </h2>
            <p className="mt-2 text-lg text-indigo-100">
                Capture your daily dev learnings in one powerful place.
            </p>
            <div className="mt-6">

                <Button asChild size="lg" className="bg-white dark:text-gray-800 text-primary hover:bg-gray-100">
                    <Link href={'/signup'}>
                        Create Account
                    </Link>
                </Button>
            </div>
        </section>
    );
}
