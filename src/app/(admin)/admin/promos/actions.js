"use server";

import {revalidatePath} from "next/cache";
import {fetchServerApi} from "@/lib/server-data";

export async function createPromo(payload) {
    try {
        const result = await fetchServerApi("/create-promo", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal membuat promo.");
        }

        revalidatePath("/admin/promos");
        return {success: true, message: "Promo berhasil dibuat!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

export async function updatePromo(id, payload) {
    try {
        const result = await fetchServerApi(`/update-promo/${id}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal memperbarui promo.");
        }

        revalidatePath("/admin/promos");
        return {success: true, message: "Promo berhasil diperbarui!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

export async function deletePromo(id) {
    try {
        const result = await fetchServerApi(`/delete-promo/${id}`, {
            method: "DELETE",
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal menghapus promo.");
        }

        revalidatePath("/admin/promos");
        return {success: true, message: "Promo berhasil dihapus!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}