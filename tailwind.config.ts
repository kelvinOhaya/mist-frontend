import type { Config } from "tailwindcss";
//@ts-ignore
import tailwindClipPath from "tailwind-clip-path";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindClipPath],
} satisfies Config;
