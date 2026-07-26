import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: false,
    port: 3000,
    host: "[IP_ADDRESS]",
    // strictPort: true,
    allowedHosts: [
      'vansystem.local', // <-- Yeh line add karein
      '.local',          // Ya wildcard allow kar dein
      'all'              // Ya saare hosts allow kar dein
    ],
    //   proxy: {
    //   "/subscribe": "http://localhost:5000",
    // },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
