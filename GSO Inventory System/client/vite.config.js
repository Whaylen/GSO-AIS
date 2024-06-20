import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    css: {
      devSourcemap: true,
    },
    plugins: [
      vue(),
      VitePWA({
        registerType: "prompt",
        injectRegister: "auto",
        devOptions: {
          enabled: true,
          type: "module",
        },
        workbox: {
          disableDevLogs: true,
          sourcemap: true,
          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,gif,svg,vue,ttf,eot,woff,woff2}",
          ],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => {
                return (
                  url.pathname.startsWith("/api") &&
                  !url.pathname.endsWith("csrf-cookie") &&
                  !url.pathname.endsWith("auth/permissions")
                );
              },
              handler: "NetworkFirst",
              method: "GET",
              options: {
                cacheName: "api-n-cache",
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) => {
                return url.pathname.startsWith("/favicons");
              },
              handler: "NetworkFirst",
              method: "GET",
              options: {
                cacheName: "ico-cache",
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        includeAssets: [
          "favicons/favicon.ico",
          "favicons/apple-touch-icon.png",
          "favicons/masked-icon.svg",
        ],
        manifest: {
          name: env.VITE_PRODUCT_NAME,
          short_name: env.VITE_SHORT_NAME,
          description: env.VITE_DESCRIPTION,
          theme_color: "#ffffff",
          icons: [
            {
              src: "favicons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "favicons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@vue/runtime-core":
          "@vue/runtime-core/dist/runtime-core.esm-bundler.js",
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./"),
        composables: path.resolve(__dirname, "./src/plugins/composables"),
      },
    },
    server: {
      host: "127.0.0.1",
      https: false,
      port: 8081,
      open: "http://127.0.0.1:8081", // opens browser window automatically
    },
    transpileDependencies: true,
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
      include: ["tailwind.config.mjs"],
    },
    build: {
      commonjsOptions: {
        include: ["tailwind.config.mjs", "node_modules/**"],
      },
      rollupOptions: {
        target: "esnext",
        output: {
          entryFileNames: `assets/[hash].js`,
          chunkFileNames: `assets/[hash].js`,
          assetFileNames: `assets/[hash].[ext]`,
          manualChunks(id) {
            if (id.indexOf("node_modules") !== -1) {
              const basic = id.toString().split("node_modules/")[1];
              const sub1 = basic.split("/")[0];
              if (sub1 !== ".pnpm") {
                return sub1.toString();
              }
              const name2 = basic.split("/")[1];
              return name2.split("@")[name2[0] === "@" ? 1 : 0].toString();
            }
          },
        },
      },
    },
  });
};
