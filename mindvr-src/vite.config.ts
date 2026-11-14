import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  /* 产物要嵌进作品集站点二级目录（/mindvr/），必须用相对路径 */
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});