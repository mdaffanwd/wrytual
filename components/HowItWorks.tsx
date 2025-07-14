export default function HowItWorks() {
    const steps = [
        "Learn something daily",
        "Log it in seconds",
        "Review & reflect anytime",
    ];

    return (
        <section className="text-center max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold">How it Works</h2>
            <ul className="space-y-2 text-muted-foreground text-left">
                {steps.map((step, i) => (
                    <li key={i} className="text-lg">
                        <span className="font-bold">Step {i + 1}:</span> {step}
                    </li>
                ))}
            </ul>
        </section>
    );
}
