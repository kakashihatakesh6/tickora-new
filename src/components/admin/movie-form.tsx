"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";

const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image_url: z.string().url("Must be a valid URL"),
    duration: z.string().min(1, "Duration is required"),
    language: z.string().min(1, "Language is required"),
    rating: z.coerce.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10"),
    cast: z.string().optional(), // Comma separated for simplicity in this demo
    crew: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface CastCrewMember { name: string; }
export interface MovieSubmitData extends Omit<MovieFormData, 'cast' | 'crew'> {
    cast: CastCrewMember[];
    crew: CastCrewMember[];
}

interface MovieFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MovieSubmitData) => Promise<void>;
}

export function MovieForm({ isOpen, onClose, onSubmit }: MovieFormProps) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MovieFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(movieSchema) as any,
    });

    const onFormSubmit = async (data: MovieFormData) => {
        setLoading(true);
        try {
            // Convert cast/crew strings to arrays/objects if needed, or backend handles it?
            // Backend expects JSON for cast/crew based on seed.
            // For simplicity, we'll send them as we receive or simple parsing.
            // Let's parse comma separated names into objects with name property
            const castArray = data.cast ? data.cast.split(',').map(name => ({ name: name.trim() })) : [];
            const crewArray = data.crew ? data.crew.split(',').map(name => ({ name: name.trim() })) : [];

            await onSubmit({ ...data, cast: castArray, crew: crewArray });
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
            title="Add New Movie"
            description="Enter the details of the new movie."
            size="md"
        >
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} placeholder="Movie Title" />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...register("description")} placeholder="Plot summary" />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input id="image_url" {...register("image_url")} placeholder="https://example.com/poster.jpg" />
                    {errors.image_url && <p className="text-sm text-red-500">{errors.image_url.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" {...register("duration")} placeholder="e.g. 2h 30m" />
                        {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" {...register("language")} placeholder="English, Hindi" />
                        {errors.language && <p className="text-sm text-red-500">{errors.language.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-10)</Label>
                    <Input id="rating" type="number" step="0.1" {...register("rating")} placeholder="8.5" />
                    {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cast">Cast (comma separated)</Label>
                    <Input id="cast" {...register("cast")} placeholder="Actor 1, Actor 2" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="crew">Crew (comma separated)</Label>
                    <Input id="crew" {...register("crew")} placeholder="Director, Producer" />
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Movie"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
