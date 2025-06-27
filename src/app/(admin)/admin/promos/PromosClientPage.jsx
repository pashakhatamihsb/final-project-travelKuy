"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Impor komponen AlertDialog
import {toast} from "sonner";
import {deletePromo} from "./actions";
import PromoForm from "./PromoForm";

function PromosTable({promos, onEdit, onDeleteClick}) { // Ubah nama prop
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promo Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {(promos || []).map((promo) => (
                    <tr key={promo.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{promo.title}</td>
                        <td className="px-6 py-4 text-sm font-mono text-red-600 bg-red-50 rounded w-fit">{promo.promo_code}</td>
                        <td className="px-6 py-4 text-sm">
                            {new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(promo.promo_discount_price)}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(promo)}>Edit</Button>
                            {/* Panggil onDeleteClick dengan data promo */}
                            <Button variant="destructive" size="sm" onClick={() => onDeleteClick(promo)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default function PromosClientPage({initialPromos = []}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    // State baru untuk AlertDialog
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [promoToDelete, setPromoToDelete] = useState(null);

    const handleEdit = (promo) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPromo(null);
        setIsModalOpen(true);
    };

    // Fungsi untuk membuka dialog konfirmasi
    const openDeleteDialog = (promo) => {
        setPromoToDelete(promo);
        setIsDeleteAlertOpen(true);
    };

    // Fungsi yang dijalankan saat tombol "Continue" diklik
    const handleDeleteConfirm = async () => {
        if (!promoToDelete) return;

        const result = await deletePromo(promoToDelete.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }

        setIsDeleteAlertOpen(false);
        setPromoToDelete(null);
    };

    const handleFormFinished = () => {
        setIsModalOpen(false);
        setEditingPromo(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Promos</h1>
                <Button onClick={handleCreate}>Create New Promo</Button>
            </div>

            {/* Modal Form untuk Create/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingPromo ? "Edit Promo" : "Create New Promo"}</DialogTitle>
                    </DialogHeader>
                    <PromoForm
                        key={editingPromo?.id || 'create'}
                        initialData={editingPromo}
                        onFinished={handleFormFinished}
                    />
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus promo secara permanen
                            <span className="font-semibold"> "{promoToDelete?.title}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Lanjutkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PromosTable promos={initialPromos} onEdit={handleEdit} onDeleteClick={openDeleteDialog}/>
        </div>
    );
}