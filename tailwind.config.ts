import type { Config } from "tailwindcss";
import * as defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        text: { DEFAULT: "#ffffff" },
      },
    },
  },
  plugins: [],
} as Config;
