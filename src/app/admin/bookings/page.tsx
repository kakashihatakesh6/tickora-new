"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin-service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { XCircle, CalendarX, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Booking {
    id: number;
    bookingType: string;
    seatCount: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    User?: { name: string; email: string };
    user?: { name: string; email: string };
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getBookings();
            setBookings(data);
        } catch (err: unknown) {
            const msg = (err as Error).message || "Failed to fetch bookings";
            setError(msg);
            toast.error("Failed to load bookings", { description: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setCancellingId(id);
        try {
            await adminService.cancelBooking(id);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
            );
            toast.success("Booking cancelled successfully");
        } catch (err: unknown) {
            const msg = (err as Error).message || "Failed to cancel booking";
            toast.error("Could not cancel booking", { description: msg });
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "default";
            case "PENDING":
                return "secondary";
            case "CANCELLED":
            case "FAILED":
                return "destructive";
            default:
                return "outline";
        }
    };

    // ── Loading ─────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-12 w-full" />
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-md" />
                ))}
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
                <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 gap-4">
                    <AlertCircle className="h-12 w-12 text-red-400" />
                    <p className="text-red-500 font-medium">{error}</p>
                    <Button variant="outline" onClick={fetchBookings} className="gap-2">
                        <RefreshCw className="h-4 w-4" /> Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        Total: <span className="font-semibold text-gray-900">{bookings.length}</span>
                    </span>
                    <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                        <CalendarX className="h-10 w-10 text-gray-300" />
                                        <p className="text-sm font-medium">No bookings found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">#{booking.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {booking.User?.name || booking.user?.name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {booking.User?.email || booking.user?.email || "—"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{booking.bookingType}</Badge>
                                    </TableCell>
                                    <TableCell>{booking.seatCount}</TableCell>
                                    <TableCell>₹{Number(booking.totalAmount).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {booking.createdAt
                                            ? format(new Date(booking.createdAt), "MMM d, yyyy")
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {booking.status !== "CANCELLED" &&
                                            booking.status !== "FAILED" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancellingId === booking.id}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    {cancellingId === booking.id
                                                        ? "Cancelling…"
                                                        : "Cancel"}
                                                </Button>
                                            )}
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
