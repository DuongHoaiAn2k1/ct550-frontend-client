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
    host: 'client.dacsancamau.com',
    port: 3001,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/selfsigned.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/selfsigned.crt')),
    },
    proxy: {
      "/api": {
        target: "https://dacsancamau.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  publicDir: path.resolve(__dirname, 'public'),
});
