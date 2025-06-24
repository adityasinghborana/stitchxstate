// lib/auth.ts
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function getUserIdFromSession() {
  // 1️⃣  Wait for the cookie store
  const cookieStore = await cookies();

  // 2️⃣  Read the http-only cookie that holds the JWT
  const token = cookieStore.get('token')?.value;
  if (!token) throw new Error('Unauthenticated');

  // 3️⃣  Verify & decode
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
    id?: string;          // you signed { id, email, ... }
    sub?: string;         // or { sub }
  };

  return payload.id ?? payload.sub;   // return whichever claim you use
}
