import {getAllTransactions, getAllUsers} from "@/lib/server-data";
import TransactionsClientPage from "./TransactionsClientPage";

export default async function AdminTransactionsPage() {
    // 1. Ambil semua transaksi dan semua pengguna secara bersamaan
    const [transactions, allUsers] = await Promise.all([
        getAllTransactions(),
        getAllUsers()
    ]);

    // 2. Buat sebuah "peta" untuk mencari nama pengguna dengan cepat berdasarkan ID
    const userMap = new Map((allUsers || []).map(user => [user.id, user.name]));

    // 3. Gabungkan data: tambahkan 'userName' ke setiap objek transaksi
    const transactionsWithUserData = (transactions || []).map(trx => ({
        ...trx,
        userName: userMap.get(trx.userId) // Ambil nama dari peta menggunakan trx.userId
    }));

    // 4. Teruskan data yang sudah siap ke komponen klien
    return (
        <TransactionsClientPage initialTransactions={transactionsWithUserData}/>
    );
}