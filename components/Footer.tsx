export default function Footer() {
    return (
        <footer className="pt-20 pb-10 text-center text-muted-foreground text-sm">
            <div className="space-x-6">
                <a href="https://mdaffanworks.vercel.app" className="hover:underline capitalize">About the developer</a>
                <a href="https://github.com/mdaffanwd" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub
                </a>
                <a href="#" className="hover:underline">Privacy</a>
            </div>
            <p className="mt-4">&copy; {new Date().getFullYear()} Wrytual. All rights reserved.</p>
        </footer>
    );
}
