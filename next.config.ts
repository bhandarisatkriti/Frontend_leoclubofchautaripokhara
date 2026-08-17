import type { NextConfig } from "next";

/**
 * Media uploaded through the Django admin is served by the backend, so the
 * backend origin must be allow-listed for next/image. It is derived from
 * NEXT_PUBLIC_API_URL, so pointing the site at a different backend is an
 * environment change rather than a code change.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
const { protocol, hostname, port } = new URL(apiUrl);

const isDev = process.env.NODE_ENV !== "production";

const backendPattern = {
  protocol: protocol.replace(":", "") as "http" | "https",
  hostname,
  port,
  pathname: "/media/**",
} as const;

/** Both spellings of the local backend, so either works during development. */
const localPatterns = [
  { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
  { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
] as const;

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 refuses to optimize images served from local IP addresses as
    // an SSRF guard, which blocks the Django dev server on 127.0.0.1 even
    // though it is allow-listed below. Development only — a production backend
    // sits on a public host and must not need this.
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: isDev ? [backendPattern, ...localPatterns] : [backendPattern],
  },
  async redirects() {
    return [{ source: "/membership", destination: "/join", permanent: true }];
  },
};

export default nextConfig;
