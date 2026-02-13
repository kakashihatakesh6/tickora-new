import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/movies?${searchParams.toString()}`;

  try {
    const response = await fetch(backendUrl);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies from backend' },
      { status: 500 }
    );
  }
}
