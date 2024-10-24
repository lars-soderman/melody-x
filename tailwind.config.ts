import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
        "17": "repeat(17, minmax(0, 1fr))",
        "18": "repeat(18, minmax(0, 1fr))",
        "19": "repeat(19, minmax(0, 1fr))",
        "20": "repeat(20, minmax(0, 1fr))",
        "21": "repeat(21, minmax(0, 1fr))",
        "22": "repeat(22, minmax(0, 1fr))",
        "23": "repeat(23, minmax(0, 1fr))",
        "24": "repeat(24, minmax(0, 1fr))",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /grid-cols-(\d+)/, // This will safelist all grid-cols-1, grid-cols-2, etc.
    },
  ],
};
export default config;
