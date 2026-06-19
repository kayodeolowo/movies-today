import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_READ_ACCESS_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!API_READ_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'TMDB token is not configured on the server.' },
      { status: 500 }
    );
  }

  const { path } = await params;
  const search = request.nextUrl.search; // preserves ?language=en-US&page=1
  const tmdbUrl = `${TMDB_BASE_URL}/${path.join('/')}${search}`;

  const tmdbResponse = await fetch(tmdbUrl, {
    headers: {
      Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  });

  const data = await tmdbResponse.json();
  return NextResponse.json(data, { status: tmdbResponse.status });
}
