'use client';

import {useEffect, useState} from 'react';
import {updateProfile} from '@/lib/data';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import PageHeader from '@/components/ui/PageHeader';

function getInitials(name) {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
}

// Ambil token dari cookie (client-side)
function getToken() {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

export default function ProfileClient({user: initialUser}) {
    const [user, setUser] = useState(initialUser);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({name: '', email: '', phoneNumber: '', profilePictureUrl: ''});
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState({type: '', message: ''});

    useEffect(() => {
        if (initialUser) {
            setForm({
                name: initialUser?.name || '',
                email: initialUser?.email || '',
                phoneNumber: initialUser?.phoneNumber || '',
                profilePictureUrl: initialUser?.profilePictureUrl || '',
            });
        }
    }, [initialUser]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        setNotif({type: '', message: ''});
        setForm({
            name: user?.name || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            profilePictureUrl: user?.profilePictureUrl || '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotif({type: '', message: ''});
        try {
            const token = getToken();
            await updateProfile(form, token);
            setEditMode(false);
            setNotif({type: 'success', message: 'Profil berhasil diupdate!'});
            setUser((prev) => ({
                ...prev,
                ...form,
            }));
        } catch (err) {
            setNotif({type: 'error', message: err.message || 'Gagal update profile'});
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto py-8">
                <PageHeader title="My Profile"/>
                <p className="text-center text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <PageHeader title="Profil Saya"/>
            <Card className="shadow-lg border-none bg-gradient-to-tr from-sky-50 via-white to-blue-100">
                <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 shadow-md ring-2 ring-blue-300">
                        <AvatarImage src={user.profilePictureUrl} alt={user.name}/>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-3xl font-bold text-blue-700">{user.name || 'User'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {notif.message && (
                        <div className={`rounded p-3 text-center ${notif.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {notif.message}
                        </div>
                    )}

                    {!editMode ? (
                        <>
                            <div className="flex justify-between border-b py-2">
                                <span className="font-semibold text-gray-600">Email:</span>
                                <span>{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                                <span className="font-semibold text-gray-600">Nomor Telepon:</span>
                                <span>{user.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                                <span className="font-semibold text-gray-600">Peran:</span>
                                <span className="capitalize">{user.role}</span>
                            </div>
                            <div className="flex justify-end pt-6">
                                <button
                                    className="px-6 py-2 rounded-full bg-blue-600 hover:bg-fuchsia-800 text-white font-semibold shadow"
                                    onClick={handleEdit}
                                >
                                    Edit Profil
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Nama</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Foto Profil (URL)</label>
                                <input
                                    type="url"
                                    name="profilePictureUrl"
                                    value={form.profilePictureUrl}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-800 text-white font-semibold shadow disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold shadow"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}