import { defineConfig } from "cypress";

export default defineConfig({
    includeShadowDom: true,
    e2e: {
        baseUrl: 'http://localhost:3000'
    }
});
