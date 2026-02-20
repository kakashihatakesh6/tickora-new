"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";


const sportSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    city: z.string().min(1, "City is required"),
    venue: z.string().min(1, "Venue is required"),
    dateTime: z.string().min(1, "Date and Time is required"),
    price: z.coerce.number().positive("Price must be positive"),
    totalSeats: z.coerce.number().positive("Total seats must be positive"),
    availableSeats: z.coerce.number().min(0, "Available seats must be non-negative"),
    image_url: z.string().url("Must be a valid URL"),
    team1: z.string().optional(),
    team2: z.string().optional(),
});

type SportFormData = z.infer<typeof sportSchema>;

interface SportFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SportFormData) => Promise<void>;
}

export function SportForm({ isOpen, onClose, onSubmit }: SportFormProps) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SportFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(sportSchema) as any,
    });

    const onFormSubmit = async (data: SportFormData) => {
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
            title="Add New Sport Event"
            description="Enter the details of the new sport event."
            size="md"
        >
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} placeholder="Match Title" />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" {...register("category")} placeholder="Cricket, Football..." />
                        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} placeholder="City" />
                        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input id="venue" {...register("venue")} placeholder="Stadium Name" />
                    {errors.venue && <p className="text-sm text-red-500">{errors.venue.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time</Label>
                    <Input id="dateTime" type="datetime-local" {...register("dateTime")} />
                    {errors.dateTime && <p className="text-sm text-red-500">{errors.dateTime.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" {...register("price")} placeholder="500" />
                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalSeats">Total Seats</Label>
                        <Input id="totalSeats" type="number" {...register("totalSeats")} placeholder="10000" />
                        {errors.totalSeats && <p className="text-sm text-red-500">{errors.totalSeats.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="availableSeats">Available</Label>
                        <Input id="availableSeats" type="number" {...register("availableSeats")} placeholder="10000" />
                        {errors.availableSeats && <p className="text-sm text-red-500">{errors.availableSeats.message}</p>}
                    </div>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input id="image_url" {...register("image_url")} placeholder="https://example.com/image.jpg" />
                    {errors.image_url && <p className="text-sm text-red-500">{errors.image_url.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="team1">Team 1</Label>
                        <Input id="team1" {...register("team1")} placeholder="Home Team" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="team2">Team 2</Label>
                        <Input id="team2" {...register("team2")} placeholder="Away Team" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Sport"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
