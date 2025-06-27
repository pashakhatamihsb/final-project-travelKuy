"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog"; // Impor komponen baru
import {toast} from "sonner";
import {deleteActivity} from "./actions";
import ActivityForm from "./ActivityForm";

function ActivitiesTable({activities, onEdit, onDeleteClick}) { // Ubah nama prop
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                {/* ... Thead tidak berubah ... */}
                <tbody className="bg-white divide-y divide-gray-200">
                {(activities || []).map((activity) => (
                    <tr key={activity.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{activity.title}</td>
                        <td className="px-6 py-4 text-sm"><Badge variant="outline">{activity.category?.name || 'N/A'}</Badge></td>
                        <td className="px-6 py-4 text-sm">{new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(activity.price)}</td>
                        <td className="px-6 py-4 text-sm">{activity.rating} ⭐</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(activity)}>Edit</Button>
                            {/* Panggil onDeleteClick dengan data aktivitas */}
                            <Button variant="destructive" size="sm" onClick={() => onDeleteClick(activity)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ActivitiesClientPage({initialActivities = [], initialCategories = []}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    // State untuk AlertDialog
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingActivity(null);
        setIsModalOpen(true);
    };

    // Fungsi untuk membuka dialog konfirmasi
    const openDeleteDialog = (activity) => {
        setActivityToDelete(activity);
        setIsDeleteAlertOpen(true);
    };

    // Fungsi yang dijalankan saat tombol "Continue" di dialog diklik
    const handleDeleteConfirm = async () => {
        if (!activityToDelete) return;

        const result = await deleteActivity(activityToDelete.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }

        // Tutup dialog setelah selesai
        setIsDeleteAlertOpen(false);
        setActivityToDelete(null);
    };

    const handleFormFinished = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Activities</h1>
                <Button onClick={handleCreate}>Create New Activity</Button>
            </div>

            {/* Modal Form untuk Create/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingActivity ? "Edit Activity" : "Create New Activity"}</DialogTitle>
                    </DialogHeader>
                    <ActivityForm
                        key={editingActivity?.id || 'create'}
                        categories={initialCategories}
                        initialData={editingActivity}
                        onFinished={handleFormFinished}
                    />
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the activity titled
                            <span className="font-semibold"> "{activityToDelete?.title}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ActivitiesTable activities={initialActivities} onEdit={handleEdit} onDeleteClick={openDeleteDialog}/>
        </div>
    );
}