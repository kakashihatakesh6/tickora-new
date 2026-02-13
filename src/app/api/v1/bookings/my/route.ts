import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings/my`;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}
