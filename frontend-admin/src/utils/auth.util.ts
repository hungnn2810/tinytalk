export interface DecodedToken {
  exp: number; // expiry time in seconds
  [key: string]: unknown;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  const now = Date.now() / 1000;
  return decoded.exp < now;
}
