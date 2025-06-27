"use server";

import {revalidatePath} from "next/cache";
import {fetchServerApi} from "@/lib/server-data";

export async function updateTransactionStatus(transactionId, newStatus) {
    try {
        const result = await fetchServerApi(`/update-transaction-status/${transactionId}`, {
            method: "POST",
            body: JSON.stringify({status: newStatus}),
        });

        if (result.status !== 'success' && result.status !== 'OK') {
            throw new Error(result.message || "Gagal memperbarui status transaksi.");
        }

        revalidatePath("/admin/transactions");
        return {success: true, message: "Status transaksi berhasil diperbarui!"};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

export async function getRefreshedTransactions() {
    try {
        const [transactions, allUsers] = await Promise.all([
            fetchServerApi("/all-transactions"),
            getAllUsers()
        ]);

        if (!transactions?.data || !allUsers) {
            return [];
        }

        const userMap = new Map(allUsers.map(user => [user.id, user.name]));

        const transactionsWithUserData = transactions.data.map(trx => ({
            ...trx,
            userName: userMap.get(trx.userId) || 'Unknown User'
        }));

        return transactionsWithUserData;
    } catch (error) {
        console.error("Failed to refresh transactions:", error);
        return [];
    }
}