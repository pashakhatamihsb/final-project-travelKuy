const API_BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

async function fetchApi(endpoint, options = {}) {
    const token = options.token;
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

        if (!response.ok) return null;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const getBanners = () => fetchApi("/banners");
export const getCategories = () => fetchApi("/categories");
export const getCategoryDetails = (id) => fetchApi(`/category/${id}`);
export const getActivitiesByCategoryId = (id) => fetchApi(`/activities-by-category/${id}`);
export const getPromos = () => fetchApi("/promos");
export const getPromoDetails = (id) => fetchApi(`/promo/${id}`);
export const getAllActivities = () => fetchApi("/activities");
export const getActivityDetails = (id) => fetchApi(`/activity/${id}`);
export const addToCartApi = (activityId, token) => fetchApi('/add-cart', {
    method: 'POST',
    body: JSON.stringify({activityId}),
    token: token
});
export const getCart = (token) => fetchApi('/carts', {token});
export const removeFromCartApi = (cartId, token) => fetchApi(`/delete-cart/${cartId}`, {
    method: 'DELETE',
    token: token,
});
export const updateCartItemApi = (cartId, token, quantity) => fetchApi(`/update-cart/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({quantity}),
    token: token,
});
export const getPaymentMethods = (token) => fetchApi('/payment-methods', {token});
export const createTransactionApi = (payload, token) => fetchApi('/create-transaction', {
    method: 'POST',
    body: JSON.stringify(payload),
    token: token,
});
import {cookies} from 'next/headers';

// Fungsi untuk mendapatkan semua transaksi pengguna yang sedang login
export async function getMyTransactions() {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return [];
        // Memanggil endpoint /my-transactions yang benar
        const response = await fetchApi('/my-transactions', {cache: 'no-store'}, token);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch user transactions:", error);
        return [];
    }
}

// Fungsi untuk mendapatkan detail satu transaksi berdasarkan ID
export async function getTransactionById(id) {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return null;
        const response = await fetchApi(`/transaction/${id}`, {cache: 'no-store'}, token);
        return response.data || null;
    } catch (error) {
        console.error(`Failed to fetch transaction ${id}:`, error);
        return null;
    }
}