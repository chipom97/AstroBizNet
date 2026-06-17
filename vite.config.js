import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // If deploying to GitHub Pages at https://<user>.github.io/<repo>/,
  // uncomment the next line and set it to your repo name:
  // base: "/your-repo-name/",
});
