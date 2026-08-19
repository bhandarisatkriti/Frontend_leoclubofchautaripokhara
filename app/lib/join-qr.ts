import "server-only";

import { headers } from "next/headers";
import QRCode from "qrcode";
import { joinPopupConfig } from "@/app/lib/join-popup";

/**
 * QR code for the membership form, so a visitor on a desktop can finish the
 * application on their phone.
 *
 * Rendered on the server as an inline SVG: the encoder never reaches the
 * client bundle, the code scales without blurring, and it needs no network
 * request — an <img> pointed at a third-party QR service would leak every
 * visitor's page view to that service and break whenever it is down.
 */

/**
 * The absolute URL a phone camera will open.
 *
 * A QR cannot carry a relative path, so this needs the real public origin.
 * NEXT_PUBLIC_SITE_URL is what the site already uses for Open Graph URLs, and
 * it must be set in production or the code will point at localhost.
 *
 * In development the configured origin is usually `localhost`, which a phone
 * resolves to itself — scanning the code would open nothing. There the host
 * from the request is used instead, so a code shown on a laptop reached at its
 * LAN address encodes that same address. Reading a header opts the page out of
 * static rendering, which is why it is limited to development; production
 * keeps the configured origin and the homepage stays prerendered.
 */
export async function joinUrl(): Promise<string> {
  let origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (process.env.NODE_ENV !== "production") {
    const host = (await headers()).get("host");
    if (host) origin = `http://${host}`;
  }

  return new URL(joinPopupConfig.ctaHref, origin).toString();
}

/** The QR as an SVG string, or null if encoding fails (the popup then omits it). */
export async function joinQrSvg(): Promise<string | null> {
  try {
    return await QRCode.toString(await joinUrl(), {
      type: "svg",
      // A quiet zone is part of the spec — readers need clear space around
      // the code, and without it scanning gets noticeably less reliable.
      margin: 1,
      // "M" rather than "H": the same URL needs 29x29 modules at M against
      // 37x37 at H, so every module is ~27% larger at the same physical size,
      // which is what decides how far away a phone can read it. The extra
      // damage tolerance H buys is meaningless on a clean screen.
      errorCorrectionLevel: "M",
      color: { dark: "#06142f", light: "#ffffff" },
    });
  } catch {
    return null;
  }
}
