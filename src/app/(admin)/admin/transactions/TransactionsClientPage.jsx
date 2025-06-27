"use client";

import {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {toast} from "sonner";
import {updateTransactionStatus} from "./actions";

function getStatusVariant(status) {
    switch (status) {
        case 'success':
            return 'default';
        case 'failed':
            return 'destructive';
        case 'cancelled':
            return 'secondary';
        default:
            return 'outline';
    }
}

function TransactionsTable({transactions}) {
    const [loading, setLoading] = useState(null); // Lacak loading berdasarkan ID transaksi

    const handleStatusChange = async (transactionId, newStatus) => {
        setLoading(transactionId);
        const result = await updateTransactionStatus(transactionId, newStatus);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setLoading(null);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update Status</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {(transactions || []).map((trx) => (
                    <tr key={trx.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{trx.userName || 'User Not Found'}</td>
                        <td className="px-6 py-4 text-sm">{new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(trx.totalAmount)}</td>
                        <td className="px-6 py-4 text-sm"><Badge variant={getStatusVariant(trx.status)}>{trx.status}</Badge></td>
                        <td className="px-6 py-4 text-sm">{new Date(trx.orderDate).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</td>
                        <td className="px-6 py-4 text-sm">
                            <select
                                defaultValue={trx.status}
                                onChange={(e) => handleStatusChange(trx.id, e.target.value)}
                                disabled={loading === trx.id}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:opacity-50"
                            >
                                {loading === trx.id && <option>Updating...</option>}
                                <option value="pending">Pending</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}


export default function TransactionsClientPage({initialTransactions = []}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Transactions</h1>
            </div>
            <TransactionsTable transactions={initialTransactions}/>
        </div>
    );
}