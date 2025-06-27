"use server";

import {revalidatePath} from "next/cache";
import {fetchServerApi} from "@/lib/server-data"; // Pastikan path ini benar

export async function createActivity(payload) {
    try {
        const result = await fetchServerApi("/create-activity", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal membuat aktivitas.");
        }

        revalidatePath("/admin/activities"); // Otomatis refresh data di halaman
        return {success: true, message: "Aktivitas berhasil dibuat!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

export async function updateActivity(id, payload) {
    try {
        const result = await fetchServerApi(`/update-activity/${id}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal memperbarui aktivitas.");
        }

        revalidatePath("/admin/activities");
        return {success: true, message: "Aktivitas berhasil diperbarui!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

export async function deleteActivity(id) {
    try {
        const result = await fetchServerApi(`/delete-activity/${id}`, {
            method: "DELETE",
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal menghapus aktivitas.");
        }

        revalidatePath("/admin/activities");
        return {success: true, message: "Aktivitas berhasil dihapus!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}