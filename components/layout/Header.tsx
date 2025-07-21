'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-provider/theme-button";

export default function Header() {
    const { status } = useSession();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // I wanna hide header on these routes
    const hideOnPaths = ["/login", "/signup", "/entries/new-entry"];
    const isEditPage = pathname?.includes("/edit/");

    if (hideOnPaths.includes(pathname) || isEditPage) return null;

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    return (
        <header className="z-50 min-w-screen bg-background/90 border-b shadow-sm backdrop-blur">
            <div className="max-w-7xl mx-auto w-full px-2 sm:p-4 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" aria-label="Go to homepage">
                        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                            Wrytual
                        </span>
                    </Link>
                </div>

                {/* Center: Nav Links (desktop) */}
                <nav className="hidden sm:flex gap-4">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={pathname === href ? "page" : undefined}
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-foreground px-3 py-2 rounded-md",
                                pathname === href
                                    ? "text-primary bg-muted"
                                    : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Theme toggle + Logout + Mobile Nav */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <ModeToggle />

                    {status === "authenticated" && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 hidden sm:flex"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    )}

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="sm:hidden">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-full max-w-xs sm:w-72 px-6 py-6 bg-background">
                            <div className="flex flex-col h-full justify-between">
                                {/* Top: Logo + Nav */}
                                <div className="space-y-6">
                                    {/* Logo */}
                                    <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                                        Wrytual
                                    </div>

                                    {/* Nav Links */}
                                    <nav className="flex flex-col gap-3">
                                        {navLinks.map(({ href, label }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setIsOpen(false)}
                                                aria-current={pathname === href ? "page" : undefined}
                                                className={clsx(
                                                    "text-base font-medium px-4 py-2 rounded-md transition-colors",
                                                    pathname === href
                                                        ? "text-primary bg-muted"
                                                        : "text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Bottom: Logout */}
                                {status === "authenticated" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            signOut();
                                            setIsOpen(false);
                                        }}
                                        className="w-full mt-6"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
