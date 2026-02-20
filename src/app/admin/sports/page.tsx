"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin-service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { SportForm } from "@/components/admin/sport-form";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SportItem {
    id: number;
    title: string;
    category: string;
    city: string;
    venue: string;
    dateTime: string;
    price: number;
    image_url: string;
}

export default function AdminSportsPage() {
    const [sports, setSports] = useState<SportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        try {
            const data = await adminService.getSports();
            setSports(data);
        } catch (error) {
            console.error("Failed to fetch sports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSport = async (data: Record<string, unknown>) => {
        try {
            const newSport = await adminService.createSport(data);
            setSports([newSport, ...sports]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create sport", error);
            alert("Failed to create sport");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sport event?")) return;

        try {
            await adminService.deleteSport(id);
            setSports(sports.filter((sport) => sport.id !== id));
        } catch (error) {
            console.error("Failed to delete sport", error);
            alert("Failed to delete sport");
        }
    };

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Sports & Events</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sports.map((sport) => (
                    <div key={sport.id} className="group relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all flex flex-col h-full">
                        <div className="aspect-video relative w-full">
                            <Image
                                src={sport.image_url}
                                alt={sport.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-white/90 text-black hover:bg-white">{sport.category}</Badge>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button variant="secondary" size="icon" onClick={() => handleDelete(sport.id)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-lg leading-tight mb-2">{sport.title}</h3>
                            <div className="space-y-1 text-sm text-gray-500 flex-1">
                                <p>{format(new Date(sport.dateTime), "PPP p")}</p>
                                <p>{sport.venue}, {sport.city}</p>
                                <p className="font-semibold text-black mt-2">₹{sport.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SportForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSport}
            />
        </div>
    );
}
