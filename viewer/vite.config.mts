import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, isPreview }) => ({
    plugins: [react()],
    base: command === "build" || isPreview ? "/abap-atc-cr-cv-s4hc/" : "/",
    build: {
        outDir: "build"
    },
    server: {
        port: 3000,
        strictPort: true
    },
    preview: {
        port: 3000,
        strictPort: true
    }
}));
