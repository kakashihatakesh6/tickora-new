import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams;
  const url = urlParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Validate URL structure
    new URL(url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
       console.error(`Image proxy failed for ${url}: ${response.status} ${response.statusText}`);
       return NextResponse.json({ error: `Failed to fetch image: ${response.statusText}` }, { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(blob, {
      status: 200,
      statusText: 'OK',
      headers: headers,
    });
  } catch (error) {
    console.error(`Image proxy error for url '${url}':`, error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
