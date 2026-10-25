import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'ab_admin_session';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Abubakar@2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ab-luxury-footwear-secret-key-2026';

export function createSessionToken(username: string = 'admin'): string {
  const timestamp = Date.now().toString();
  const raw = `${username}:${timestamp}:${SESSION_SECRET}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(raw).digest('hex');
  return Buffer.from(`${username}:${timestamp}:${signature}`).toString('base64');
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp, signature] = decoded.split(':');
    if (!username || !timestamp || !signature) return false;

    // Check expiration (7 days)
    const ageMs = Date.now() - parseInt(timestamp, 10);
    if (isNaN(ageMs) || ageMs > 7 * 24 * 60 * 60 * 1000 || ageMs < 0) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${username}:${timestamp}:${SESSION_SECRET}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (err) {
    return false;
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return verifySessionToken(sessionCookie?.value);
}

export function validateAdminCredentials(password: string): boolean {
  if (!password) return false;
  const configuredPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return password.trim() === configuredPassword.trim();
}

export { SESSION_COOKIE_NAME };
