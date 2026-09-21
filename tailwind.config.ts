import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#DC2626", // TODO: SESUAIKAN_MERAH_BRAND_ANDA jika ada hex resmi
          dark: "#991B1B",
          light: "#FEE2E2",
        },
      },
    },
  },
  plugins: [],
};
export default config;
