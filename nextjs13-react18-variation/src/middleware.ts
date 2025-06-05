import { NextRequest, NextResponse } from "next/server";
import { HACKLE_DEVICE_COOKIE_NAME } from "./hackle/cookies";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * @description client<->server identifier synchronization
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) return;
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  )
    return;

  let nextResponse: NextResponse | null = null;
  const deviceIdInCookie = req.cookies.get(HACKLE_DEVICE_COOKIE_NAME)?.value;

  nextResponse = nextResponse ?? NextResponse.next();

  /**
   * create new deviceId in cookie, if deviceId inexists.
   * then, clientside hackle sdk use this deviceId (in cookie) as default deviceId.
   */
  if (!deviceIdInCookie) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const did = crypto.randomUUID();
    nextResponse.cookies.set(HACKLE_DEVICE_COOKIE_NAME, did, {
      domain: req.nextUrl.hostname,
      expires,
    });
  }

  return nextResponse;
}
