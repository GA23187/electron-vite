import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path"); //必须要引入resolve

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", //服务的公共基础路径
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")//resolve(__dirname, "src"),
    },
  },
});
