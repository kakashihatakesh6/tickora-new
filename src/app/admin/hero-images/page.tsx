"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin-service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { HeroImageForm } from "@/components/admin/hero-image-form";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface HeroImageItem {
    id: number;
    imageUrl: string;
    title?: string;
    description?: string;
    active: boolean;
}

export default function AdminHeroImagesPage() {
    const [images, setImages] = useState<HeroImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const data = await adminService.getHeroImages();
            setImages(data);
        } catch (error) {
            console.error("Failed to fetch hero images", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = async (data: Omit<HeroImageItem, 'id'>) => {
        try {
            const newImage = await adminService.createHeroImage(data);
            setImages([newImage, ...images]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create hero image", error);
            alert("Failed to create hero image");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this hero image?")) return;

        try {
            await adminService.deleteHeroImage(id);
            setImages(images.filter((img) => img.id !== id));
        } catch (error) {
            console.error("Failed to delete hero image", error);
            alert("Failed to delete hero image");
        }
    };

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Hero Images</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Image
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((image) => (
                    <div key={image.id} className="group relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all">
                        <div className="aspect-video relative w-full">
                            <Image
                                src={image.imageUrl}
                                alt={image.title || "Hero Image"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute top-2 right-2">
                                <Badge variant={image.active ? "default" : "secondary"}>
                                    {image.active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button variant="secondary" size="icon" onClick={() => handleDelete(image.id)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        {(image.title || image.description) && (
                            <div className="p-4">
                                {image.title && <h3 className="font-bold">{image.title}</h3>}
                                {image.description && <p className="text-sm text-gray-500">{image.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <HeroImageForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddImage}
            />
        </div>
    );
}
