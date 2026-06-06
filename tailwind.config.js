import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#10b981", // Emerald
          secondary: "#3b82f6", // Blue
          accent: "#a855f7", // Purple
          neutral: "#1f2937",
          "base-100": "#111827", // Dark Gray
          info: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "light",
    ],
  },
}
