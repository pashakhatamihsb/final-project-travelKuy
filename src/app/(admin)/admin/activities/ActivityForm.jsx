"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {createActivity, updateActivity} from "./actions";

export default function ActivityForm({categories, initialData, onFinished}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Isi form dengan data awal saat mode edit, atau kosongkan saat mode create
        setFormData({
            title: initialData?.title || '',
            categoryId: initialData?.categoryId || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            price_discount: initialData?.price_discount || 0,
            rating: initialData?.rating || 0,
            total_reviews: initialData?.total_reviews || 0,
            facilities: initialData?.facilities || '',
            address: initialData?.address || '',
            province: initialData?.province || '',
            city: initialData?.city || '',
            location_maps: initialData?.location_maps || '',
            imageUrls: initialData?.imageUrls?.length > 0 ? initialData.imageUrls : ['']
        });
    }, [initialData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...formData.imageUrls];
        newUrls[index] = value;
        setFormData(prev => ({...prev, imageUrls: newUrls}));
    };

    const addImageUrlInput = () => setFormData(prev => ({...prev, imageUrls: [...prev.imageUrls, ""]}));
    const removeImageUrlInput = (index) => setFormData(prev => ({...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index)}));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: Number(formData.price),
            price_discount: Number(formData.price_discount),
            rating: Number(formData.rating),
            total_reviews: Number(formData.total_reviews),
            imageUrls: formData.imageUrls.filter(url => url && url.trim() !== ""),
        };

        const result = initialData
            ? await updateActivity(initialData.id, payload)
            : await createActivity(payload);

        if (result.success) {
            toast.success(result.message);
            onFinished(); // Menutup modal
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            {/* Title */}
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required/>
            </div>

            {/* Category */}
            <div>
                <Label htmlFor="categoryId">Category</Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required
                        className="w-full mt-1 p-2 border rounded-md bg-white">
                    <option value="">Select a category</option>
                    {(categories || []).map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>

            {/* Description */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange}/>
            </div>

            {/* Image URLs */}
            <div>
                <Label>Image URLs</Label>
                {formData.imageUrls?.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input type="url" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)}
                               placeholder="https://example.com/image.jpg"/>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeImageUrlInput(index)}>Remove</Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrlInput}>Add Image URL</Button>
            </div>

            {/* Other fields... */}
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : (initialData ? "Update Activity" : "Create Activity")}
                </Button>
            </div>
        </form>
    );
}