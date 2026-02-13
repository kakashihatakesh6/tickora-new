export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    image_url: string;
    available_seats?: number;
    format?: string;
    language?: string;
    screen_number?: string;
    ticket_level?: string;
}

export interface Booking {
    id: number;
    event: Event;
    seat_count: number;
    seat_numbers: string[];
    total_amount: number;
    status: string;
    created_at: string;
    ticket?: {
        unique_code: string;
    };
}
