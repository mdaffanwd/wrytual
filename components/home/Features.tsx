const features = [
    { emoji: "💡", title: "Journaling", text: "Daily developer journaling for growth and clarity." },
    { emoji: "🏷️", title: "Smart Tags", text: "Organize logs by tags and topics effortlessly." },
    { emoji: "📈", title: "Progress Tracking", text: "See how far you've come over time." },
];

export default function Features() {
    return (
        <section className="max-w-screen-lg mx-auto text-center space-y-10">
            <h2 className="text-3xl font-bold">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <div key={i} className="rounded-xl border p-6 shadow-sm hover:shadow-md bg-card transition">
                        <div className="text-4xl">{f.emoji}</div>
                        <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                        <p className="text-muted-foreground mt-2">{f.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
