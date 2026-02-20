"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";


const heroImageSchema = z.object({
    imageUrl: z.string().url("Must be a valid URL"),
    title: z.string().optional(),
    description: z.string().optional(),
    active: z.boolean().default(true),
});

type HeroImageFormData = z.infer<typeof heroImageSchema>;

interface HeroImageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: HeroImageFormData) => Promise<void>;
}

export function HeroImageForm({ isOpen, onClose, onSubmit }: HeroImageFormProps) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<HeroImageFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(heroImageSchema) as any,
        defaultValues: {
            active: true,
        }
    });

    const onFormSubmit = async (data: HeroImageFormData) => {
        setLoading(true);
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Form submission failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Add Hero Image"
            description="Add a new image for the homepage hero carousel."
            size="md"
        >
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" {...register("imageUrl")} placeholder="https://example.com/banner.jpg" />
                    {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input id="title" {...register("title")} placeholder="Banner Title" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" {...register("description")} placeholder="Banner Description" />
                </div>

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="active" {...register("active")} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Image"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
