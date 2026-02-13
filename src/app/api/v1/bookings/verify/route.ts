import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = request.headers.get('authorization');

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings/verify`;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}
