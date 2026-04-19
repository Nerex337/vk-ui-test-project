import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { heyApiPlugin } from "@hey-api/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    heyApiPlugin({
      config: {
        input: "./openapi.json",
        output: "src/client",
      },
    }),
  ],
  server: {
    proxy: {
      "/back": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [
      { find: /^@vkontakte\/vkui$/, replacement: "@vkontakte/vkui/dist/cssm" },
    ],
  },
});
