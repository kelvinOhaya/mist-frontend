// tailwind.config.js
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        prixClipFix: {
          "0%": {
            clipPath: "polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)",
          },
          "25%": {
            clipPath: "polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)",
          },
          "50%": {
            clipPath:
              "polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)",
          },
          "75%": {
            clipPath: "polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)",
          },
          "100%": {
            clipPath: "polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)",
          },
        },
      },
      animation: {
        prixClipFix: "prixClipFix 2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
