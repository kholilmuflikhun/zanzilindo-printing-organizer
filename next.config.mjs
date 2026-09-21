/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // TODO: PERSEMPIT_KE_DOMAIN_CDN_ANDA sebelum production
    ],
  },
};
export default nextConfig;
