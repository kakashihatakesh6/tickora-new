
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BookingCardSkeleton() {
    return (
        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg rounded-2xl">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-full max-w-[200px]" />
                    </div>
                    <div className="flex flex-col items-end justify-center">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function EventCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

export function EventDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Skeleton */}
            <div className="relative h-[50vh] w-full overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-3/4" />
                            <div className="flex gap-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>

                    {/* Sidebar/Booking Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-2xl border bg-card p-6 shadow-lg space-y-6">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SeatLayoutSkeleton() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="text-center space-y-4">
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                </div>

                {/* Screen */}
                <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-b-xl opacity-50" />

                {/* Seats Grid */}
                <div className="space-y-4 mt-12">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                        <div key={row} className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
                                <Skeleton key={seat} className="h-8 w-8 rounded-md" />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Footer Action */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
