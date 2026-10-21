import type { NextConfig } from "next";

const SITE = "https://farooqshabbir.online";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Old domain → new domain, path preserved (308 keeps search ranking).
      ...["farooqshabbir.site", "www.farooqshabbir.site"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${SITE}/:path*`,
        permanent: true,
      })),
      // Pages from the previous static site.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/#about", permanent: true },
      { source: "/projects.html", destination: "/#work", permanent: true },
      { source: "/services.html", destination: "/#services", permanent: true },
      { source: "/contact.html", destination: "/#contact", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
