// src/app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://zanzilindo.com"; // TODO: GANTI_DENGAN_DOMAIN_ASLI_ANDA

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/member/", // area privat member tidak perlu diindeks
          "/api/", // endpoint API tidak perlu diindeks
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
