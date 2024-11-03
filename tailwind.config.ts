import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geistMono: "--font-geist-mono",
        geistSans: "--font-geist-sans",
      },
    },
  },
  plugins: [],
};
export default config;
