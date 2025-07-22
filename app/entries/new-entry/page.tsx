"use client";

import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Spinner from "@/components/ui/spinner";

// Zod schema
const entrySchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    tags: z.string().optional(),
});

type EntryForm = z.infer<typeof entrySchema>;


export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EntryForm>({
        resolver: zodResolver(entrySchema),
    });


    const onSubmit = async (data: EntryForm) => {
        const entry = {
            title: data.title,
            description: data.description,
            tags: data.tags?.split(",").map((tag) => tag.trim()) || [],
        };
        console.log(entry)

        await fetch("/api/entries", {
            method: "POST",
            body: JSON.stringify(entry),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (!res.ok) throw new Error("Failed to save");
            return res.json();
        })
            .then(() => router.push("/dashboard"))
            .catch((err) => {
                console.error(err);
                alert("Failed to submit entry");
            });
    };

    if (status === "loading") return <Spinner />
    if (!session) redirect("/login")
    return (
        <div className="flex justify-center items-center min-h-screen px-4 bg-muted">
            <Card className="w-full max-w-2xl py-4">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-2xl font-semibold">New Wrytual Entry</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                className="w-full"
                                placeholder="Explored Server Actions in Next.js"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">What did you learn?</Label>
                            <Textarea
                                id="description"
                                className="w-full min-h-[150px]"
                                placeholder="Learned how to handle mutations using server actions..."
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                className="w-full"
                                placeholder="Next.js, TypeScript, Closures"
                                {...register("tags")}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.back()}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">
                                Save Entry
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
