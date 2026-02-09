import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendUrl = `http://localhost:8080/api/v1/sports/${id}`;

  try {
    const response = await fetch(backendUrl);
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sport from backend' },
      { status: 500 }
    );
  }
}
