"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

interface EventItem {
    id: number;
    title: string;
    eventType: string;
    city: string;
    dateTime: string;
    price: number;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await adminService.getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await adminService.deleteEvent(id);
            setEvents(events.filter((event) => event.id !== id));
        } catch (error) {
            console.error("Failed to delete event", error);
            alert("Failed to delete event");
        }
    };

    if (loading) {
        return <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Events (Concerts, Plays, etc.)</h2>
                {/* Add Event Button could be added here if we create a form for it */}
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{event.eventType}</TableCell>
                                    <TableCell>{event.city}</TableCell>
                                    <TableCell>{new Date(event.dateTime).toLocaleDateString()}</TableCell>
                                    <TableCell>₹{event.price}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
