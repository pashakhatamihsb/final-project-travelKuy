// src/components/ui/navbar.jsx

import Link from "next/link";
import {cookies} from "next/headers";
import {Plane} from "lucide-react";
import {Button} from "@/components/ui/button";
import {logout} from "@/features/authentication/actions";
import SearchModal from "@/features/search/components/SearchModal";
import {getAllActivities} from "@/lib/data";
import NavigationLinks from "@/components/ui/NavigationLinks";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";

export default async function Navbar() {
    // [FIX] cookies() sekarang adalah fungsi async dan HARUS di-await
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("user")?.value;

    let user = null;
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);
        } catch (e) {
            console.error("Failed to parse user cookie:", e);
        }
    }

    const isLoggedIn = !!token;

    const activitiesData = await getAllActivities();
    const activities = activitiesData?.data || [];

    const navLinks = [
        {href: "/", label: "Home"},
        {href: "/categories", label: "Categories"},
        {href: "/activities", label: "Activities"},
        {href: "/promos", label: "Promos"},
        {href: "/about", label: "About"},
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <MobileMenu navLinks={navLinks}/>
                    <Link href="/" className="flex items-center gap-2">
                        <Plane className="h-6 w-6 text-blue-600"/>
                        <span className="text-xl font-bold text-gray-800">TravelKuy</span>
                    </Link>
                </div>

                <div className="hidden md:flex">
                    <NavigationLinks navLinks={navLinks}/>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <SearchModal activities={activities}/>
                    {/* Pass authentication status to CartIcon */}
                    <CartIcon isAuthenticated={isLoggedIn}/>
                    <div className="hidden md:block h-6 border-l"></div>
                    {isLoggedIn && user ? (
                        <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Halo, {user.name || "Pengguna"}
              </span>
                            <form action={logout}>
                                <Button variant="outline" size="sm">
                                    Logout
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
