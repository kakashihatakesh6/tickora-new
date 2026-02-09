import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendUrl = `http://localhost:8080/api/v1/bookings/${id}`;
  
  console.log(`[Proxy] Fetching booking ${id} from ${backendUrl}`);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = request.headers.get('authorization');
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });
    
    console.log(`[Proxy] Backend response status: ${response.status}`);
    
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
