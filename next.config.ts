import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import createNextIntlPlugin from "next-intl/plugin";

const backendImagePatterns: RemotePattern[] = (() => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return [];

  try {
    const url = new URL(backendUrl);
    const commonPattern = {
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/uploads/**",
    };

    return [
      { protocol: "http", ...commonPattern },
      { protocol: "https", ...commonPattern },
    ];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...backendImagePatterns,
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      } as const,
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      } as const,
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
