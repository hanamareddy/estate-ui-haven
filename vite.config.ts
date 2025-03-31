
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add aliases for Node.js built-ins
      'util': path.resolve(__dirname, './src/polyfills/util.js'),
      'crypto': path.resolve(__dirname, './src/polyfills/crypto.js'),
      'process': path.resolve(__dirname, './src/polyfills/process.js'),
    },
  },
  define: {
    // Extensive process.env polyfill
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'process.nextTick': '((cb) => setTimeout(cb, 0))'
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      // Ensure we don't bundle node-specific modules
      external: ['fs', 'path', 'stream', 'os', 'net'],
    }
  }
}));
