import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Порт 3002: 3000 — приложение сотрудника, 3001 — приложение руководителя
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3002,
    strictPort: true,
    hmr: { port: 3002 },
  },
});
