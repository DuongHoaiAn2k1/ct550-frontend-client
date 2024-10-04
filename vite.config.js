import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: 'localhost',
    port: 3001,
    proxy: {
      "/api": {
        target: "https://luanvantotnghiep.io.vn:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  publicDir: path.resolve(__dirname, 'public'),
});