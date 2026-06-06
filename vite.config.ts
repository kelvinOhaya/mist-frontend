import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@clouds": path.resolve(__dirname, "./src/assets/clouds"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    cors: true,
    // Allow requests from tunneling services and local network
    allowedHosts: [
      "localhost",
      ".localtunnel.me",
      ".loca.lt",
      ".ngrok.io",
      ".ngrok-free.app",
      ".trycloudflare.com",
    ],
    hmr: {
      clientPort: 5173,
    },
  },
});
