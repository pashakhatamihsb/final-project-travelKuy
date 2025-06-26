import {cookies} from 'next/headers';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import {getCart} from '@/lib/data';
import CartInitializer from '@/components/providers/CartInitializer';
import {Toaster} from "@/components/ui/sonner"; // Import Toaster

export default async function UserLayout({children}) {
    // [FIX] cookies() harus di-await.
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let initialCart = [];

    if (token) {
        const cartData = await getCart(token);
        if (cartData && cartData.data) {
            initialCart = cartData.data;
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <CartInitializer cart={initialCart}/>
            <Navbar/>
            <main className="flex-grow">
                {children}
                {/* [ADD] Toaster untuk notifikasi, sebaiknya ada di layout */}
                <Toaster position="top-center" richColors/>
            </main>
            <Footer/>
        </div>
    );
}
