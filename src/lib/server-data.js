// src/lib/server-data.js

import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';

const API_BASE_URL = process.env.API_BASE_URL || "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = process.env.API_KEY || "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export async function fetchServerApi(endpoint, options = {}) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token && options.authRequired !== false) {
        return {status: 'error', message: 'Unauthorized'};
    }

    const headers = {
        apiKey: API_KEY,
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) notFound();
            throw new Error(errorData.message || `Failed to fetch API: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(`[SERVER_API_ERROR] ${endpoint}:`, error);
        if (error.message.includes('NEXT_NOT_FOUND')) notFound();
        return {status: 'error', message: error.message, data: []};
    }
}

export async function getMyTransactions() {
    const result = await fetchServerApi('/my-transactions');
    if (result.status === 'OK' || result.status === 'success') {
        return result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
}

export async function getTransactionById(id) {
    if (!id) return null;
    const result = await fetchServerApi(`/transaction/${id}`);
    if (result.status === 'OK' || result.status === 'success') {
        return result.data;
    }
    return null;
}

export async function addToCartWithBookingDetails(prevState, formData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return {
                status: 'error',
                message: 'Token tidak ditemukan. Silakan login kembali.'
            };
        }

        // Extract comprehensive form data
        const activityId = formData.get('activityId');
        const selectedDate = formData.get('selectedDate');
        const guestCount = parseInt(formData.get('guestCount'));
        const specialRequests = formData.get('specialRequests') || '';

        // Validation
        if (!activityId || !selectedDate || !guestCount || guestCount < 1) {
            return {
                status: 'error',
                message: 'Semua field harus diisi dengan benar'
            };
        }

        // Validate date
        const bookingDate = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (bookingDate < today) {
            return {
                status: 'error',
                message: 'Tanggal booking tidak boleh di masa lalu'
            };
        }

        // Enhanced payload
        const cartPayload = {
            activityId,
            bookingDate: selectedDate,
            guestCount,
            specialRequests,
            // Add timestamp for tracking
            addedAt: new Date().toISOString()
        };

        console.log('Adding to cart with enhanced payload:', cartPayload);

        const result = await addToCartApi(activityId, token, cartPayload);

        if (result && (result.status === 'OK' || result.status === 'success')) {
            return {
                status: 'success',
                message: `Berhasil ditambahkan ke keranjang! ${guestCount} tamu untuk tanggal ${new Date(selectedDate).toLocaleDateString('id-ID')}`,
                data: result.data
            };
        } else {
            return {
                status: 'error',
                message: result?.message || 'Gagal menambahkan ke keranjang'
            };
        }

    } catch (error) {
        console.error('Add to cart server action error:', error);
        return {
            status: 'error',
            message: 'Terjadi kesalahan server: ' + error.message
        };
    }
}

// --- FUNGSI UNTUK ADMIN ---

export async function getAllUsers() {
    // Memanggil fungsi yang benar: fetchServerApi
    const result = await fetchServerApi("/all-user");
    // Mengembalikan data jika sukses, jika tidak, array kosong
    if (result && (result.status === 'OK' || result.status === 'success')) {
        return result.data;
    }
    return [];
}

export async function getAllTransactions() {
    // Memanggil fungsi yang benar: fetchServerApi
    const result = await fetchServerApi("/all-transactions");
    if (result && (result.status === 'OK' || result.status === 'success')) {
        return result.data;
    }
    return [];
}


// --- FUNGSI UNTUK DATA PUBLIK & PENGGUNA ---

export async function getAllActivities() {
    // Memanggil fungsi yang benar: fetchServerApi
    const result = await fetchServerApi("/activities", {authRequired: false});
    if (result && (result.status === 'OK' || result.status === 'success')) {
        return result.data;
    }
    return [];
}


export async function getAllPromos() {
    // Memanggil fungsi yang benar: fetchServerApi
    const result = await fetchServerApi("/promos", {authRequired: false});
    if (result && (result.status === 'OK' || result.status === 'success')) {
        return result.data;
    }
    return [];
}

export async function getAllCategories() {
    const result = await fetchServerApi("/categories", {authRequired: false});
    // Pastikan selalu mengembalikan array
    return result?.data || [];
}

export async function getBannerDetails(id) {
    const result = await fetchServerApi(`/banner/${id}`, {authRequired: false});
    if (result && (result.status === 'OK' || result.status === 'success')) {
        return result.data;
    }
    // Kembalikan null jika banner tidak ditemukan
    return null;
}