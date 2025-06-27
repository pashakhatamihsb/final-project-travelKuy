"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {createPromo, updatePromo} from "./actions";

export default function PromoForm({initialData, onFinished}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        terms_condition: '',
        promo_code: '',
        promo_discount_price: 0,
        minimum_claim_price: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                imageUrl: initialData.imageUrl || '',
                terms_condition: initialData.terms_condition || '',
                promo_code: initialData.promo_code || '',
                promo_discount_price: initialData.promo_discount_price || 0,
                minimum_claim_price: initialData.minimum_claim_price || 0,
            });
        } else {
            // Reset form untuk mode "Create"
            setFormData({
                title: '', description: '', imageUrl: '', terms_condition: '',
                promo_code: '', promo_discount_price: 0, minimum_claim_price: 0,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            promo_discount_price: Number(formData.promo_discount_price),
            minimum_claim_price: Number(formData.minimum_claim_price),
        };

        const result = initialData
            ? await updatePromo(initialData.id, payload)
            : await createPromo(payload);

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
            <div>
                <Label htmlFor="title">Promo Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required/>
            </div>
            <div>
                <Label htmlFor="promo_code">Promo Code</Label>
                <Input id="promo_code" name="promo_code" value={formData.promo_code} onChange={handleChange} required/>
            </div>
            <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required/>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange}/>
            </div>
            <div>
                <Label htmlFor="terms_condition">Terms & Condition</Label>
                <Textarea id="terms_condition" name="terms_condition" value={formData.terms_condition} onChange={handleChange}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="promo_discount_price">Discount Price (IDR)</Label>
                    <Input id="promo_discount_price" name="promo_discount_price" type="number" value={formData.promo_discount_price} onChange={handleChange}
                           required/>
                </div>
                <div>
                    <Label htmlFor="minimum_claim_price">Minimum Claim Price (IDR)</Label>
                    <Input id="minimum_claim_price" name="minimum_claim_price" type="number" value={formData.minimum_claim_price} onChange={handleChange}
                           required/>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : (initialData ? "Update Promo" : "Buat Promo")}
                </Button>
            </div>
        </form>
    );
}