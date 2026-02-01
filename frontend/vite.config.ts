import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { wrapVinxiConfigWithSentry } from '@sentry/tanstackstart-react'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

const config = defineConfig({
  esbuild: {
    target: 'esnext',
    legalComments: 'none',
    treeShaking: true,
  },

  plugins: [
    nitroV2Plugin({
      compatibilityDate: '2025-11-06',
      preset: 'node-server',
      minify: true,
      timing: false,
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
      loose: true,
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  build: {
    target: 'esnext',
    sourcemap: false,
    cssMinify: true,
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  worker: { format: 'es' },
  cacheDir: './node_modules/.vite-cache',
  server: {
    watch: {
      ignored: ['**/dist/**', '**/.output/**'],
    },
  },
})

export default wrapVinxiConfigWithSentry(config, {
  org: process.env.VITE_SENTRY_ORG,
  project: process.env.VITE_SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
})
