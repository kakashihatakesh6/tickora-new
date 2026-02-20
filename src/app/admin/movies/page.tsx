"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin-service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { MovieForm, MovieSubmitData } from "@/components/admin/movie-form";
import Image from "next/image";

interface MovieItem {
    id: number;
    title: string;
    image_url: string;
    rating: number;
    language: string;
}

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const data = await adminService.getMovies();
            setMovies(data);
        } catch (error) {
            console.error("Failed to fetch movies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMovie = async (data: MovieSubmitData) => {
        try {
            const newMovie = await adminService.createMovie(data);
            setMovies([newMovie, ...movies]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create movie", error);
            alert("Failed to create movie");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this movie?")) return;

        try {
            await adminService.deleteMovie(id);
            setMovies(movies.filter((movie) => movie.id !== id));
        } catch (error) {
            console.error("Failed to delete movie", error);
            alert("Failed to delete movie");
        }
    };

    if (loading) {
        return <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Movie
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <div key={movie.id} className="group relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all">
                        <div className="aspect-[2/3] relative w-full">
                            <Image
                                src={movie.image_url}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button variant="secondary" size="icon" onClick={() => handleDelete(movie.id)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold truncate" title={movie.title}>{movie.title}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                                <span>{movie.rating} ★</span>
                                <span>{movie.language}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <MovieForm
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddMovie}
            />
        </div>
    );
}
