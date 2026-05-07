import { NextResponse } from 'next/server';
import sql from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }

  try {
    let result;
    if (mode) {
      result = await sql`
        SELECT username, score, mode, level, created_at 
        FROM leaderboard 
        WHERE mode = ${mode} 
        ORDER BY score DESC 
        LIMIT 10
      `;
    } else {
      result = await sql`
        SELECT username, score, mode, level, created_at 
        FROM leaderboard 
        ORDER BY score DESC 
        LIMIT 10
      `;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Leaderboard Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
  }

  try {
    const { username, score, mode, level } = await request.json();

    if (!username || typeof score !== 'number' || !mode || typeof level !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sql`
      INSERT INTO leaderboard (username, score, mode, level)
      VALUES (${username}, ${score}, ${mode}, ${level})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leaderboard Submit Error:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
