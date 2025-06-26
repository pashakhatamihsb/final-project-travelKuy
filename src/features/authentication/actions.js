'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

/**
 * Fungsi terpusat untuk melakukan panggilan API.
 */
async function apiCall(endpoint, options = {}, token = null) {
    const baseUrl = process.env.API_BASE_URL || "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
    const apiKey = process.env.API_KEY || "24405e01-fbc1-45a5-9f5a-be13afcd757c";

    const headers = {
        'apiKey': apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {cache: 'no-store', ...options, headers});

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Respons dari server tidak valid. Status: ${response.status}`);
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada permintaan API.');
    }
    return data;
}

// --- Aksi Otentikasi ---
export async function login(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return {status: 'error', message: 'Email dan password harus diisi'};
    }

    let result;
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': process.env.API_KEY,
            },
            body: JSON.stringify({email, password}),
        });

        result = await response.json();

        if (!response.ok) {
            return {status: 'error', message: result.message || 'Login gagal'};
        }

        // Set cookies
        const cookieStore = cookies();
        cookieStore.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        cookieStore.set('user', JSON.stringify(result.data), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

    } catch (error) {
        console.error('Login error:', error);
        return {status: 'error', message: 'Terjadi kesalahan saat login'};
    }

    // Pindahkan logika redirect KELUAR dari try-catch
    const callbackUrl = formData.get('callbackUrl');
    const loginIntent = formData.get('login_intent');
    let redirectUrl = '/';

    if (loginIntent === 'add_to_cart' && callbackUrl) {
        redirectUrl = callbackUrl;
    } else if (loginIntent === 'cart_access') {
        redirectUrl = '/cart';
    } else if (callbackUrl) {
        redirectUrl = callbackUrl;
    }

    redirect(redirectUrl);
}

export async function register(prevState, formData) {
    try {
        const name = formData.get("name");
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordRepeat = formData.get('passwordRepeat');

        if (password !== passwordRepeat) {
            return {status: 'error', message: 'Password dan Ulangi Password tidak cocok.'};
        }

        const dataToSend = {
            email, name, password, passwordRepeat,
            role: formData.get('role'),
            phoneNumber: formData.get('phoneNumber'),
            profilePictureUrl: `https://placehold.co/200x200/E2E8F0/4A5568?text=${name.charAt(0).toUpperCase()}`,
        };

        await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });

        return {status: 'success', message: 'Registrasi berhasil!'};
    } catch (error) {
        return {status: 'error', message: error.message || 'Terjadi kesalahan saat registrasi.'};
    }
}

export async function logout() {
    const cookieStore = cookies(); // Tidak perlu await di sini
    cookieStore.delete('token');
    cookieStore.delete('user');
    redirect('/');
}

// --- Aksi Keranjang (Cart) ---
export async function addToCart(prevState, formData) {
    const pathname = formData.get('pathname');
    const cookieStore = cookies(); // Tidak perlu await di sini
    const token = cookieStore.get('token')?.value;

    if (!token) {
        const loginUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
        loginUrl.searchParams.set('callbackUrl', pathname);
        loginUrl.searchParams.set('login_intent', 'add_to_cart');

        const cartData = {
            activityId: formData.get('activityId'),
            selectedDate: formData.get('selectedDate'),
            guestCount: formData.get('guestCount'),
        };
        const encodedCartData = Buffer.from(JSON.stringify(cartData)).toString('base64');
        loginUrl.searchParams.set('restore_cart', encodedCartData);

        redirect(loginUrl.toString());
    }

    try {
        const activityId = formData.get('activityId');
        const result = await apiCall('/add-cart', {method: 'POST', body: JSON.stringify({activityId})}, token);
        revalidatePath('/cart');
        return {status: 'success', message: result.message || 'Item berhasil ditambahkan!'};
    } catch (error) {
        return {status: 'error', message: error.message || 'Gagal menambahkan item.'};
    }
}


export async function removeFromCart(cartId) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        await apiCall(`/delete-cart/${cartId}`, {method: 'DELETE'}, token);
        revalidatePath('/cart');
        return {status: 'success', message: 'Item berhasil dihapus.'};
    } catch (error) {
        return {status: 'error', message: error.message};
    }
}

export async function updateCartQuantity(cartId, quantity) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        if (quantity < 1) return {status: 'error', message: 'Jumlah tidak valid.'};
        await apiCall(`/update-cart/${cartId}`, {method: 'POST', body: JSON.stringify({quantity})}, token);
        revalidatePath('/cart');
        return {status: 'success'};
    } catch (error) {
        return {status: 'error', message: error.message};
    }
}