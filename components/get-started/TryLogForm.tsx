"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TryLogForm() {
    const [title, setTitle] = useState("Your Sample Log Title");
    const [entry, setEntry] = useState("");
    const [tag, setTag] = useState("");
    const [autoPreview, setAutoPreview] = useState(true);
    const [manualPreview, setManualPreview] = useState(false);

    const tagList = tag
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

    const showPreview = autoPreview || manualPreview;

    return (
        <section className={`w-full ${showPreview ? "grid md:grid-cols-2 gap-6" : ""}`}>
            {/* Input Form */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Title
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-semibold"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Log Entry
                    </label>
                    <Textarea
                        placeholder="What did you learn today?"
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        className="min-h-[150px]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Tags (comma-separated)
                    </label>
                    <Input
                        placeholder="e.g. React, Git"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={autoPreview ? "default" : "outline"}
                        onClick={() => {
                            setAutoPreview(!autoPreview);
                            if (!autoPreview) setManualPreview(false); // autoPreview takes over
                        }}
                    >
                        {autoPreview ? "Auto Preview: On" : "Auto Preview: Off"}
                    </Button>

                    <Button
                        variant="outline"
                        disabled={autoPreview}
                        onClick={() => setManualPreview((prev) => !prev)}
                    >
                        {manualPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                </div>
            </div>

            {/* Preview */}
            {showPreview && (
                <Card className={`bg-secondary/40 shadow-lg border border-border`}>
                    <CardContent className="space-y-4 h-full">
                        <h2 className="text-xl font-semibold">{title || "Untitled Log"}</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {entry || "Start typing in the log to see the preview..."}
                        </p>
                        {tagList.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tagList.map((t, i) => (
                                    <Badge key={i}>{t}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

        </section>
    );
}