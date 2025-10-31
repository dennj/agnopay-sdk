import { defineConfig } from 'tsup';

// Configuration for module builds (ESM, CJS)
const moduleConfig = defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    server: 'src/server.ts',
    types: 'src/types.ts',
    'client-hooks': 'src/client-hooks.ts',
    'checkout-widget': 'src/checkout-widget.ts',
    'components/AgnoPayCheckout': 'src/components/AgnoPayCheckout.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: false, // Don't bundle - keep files separate
  treeshake: false, // Don't tree-shake to preserve directives
  minify: false,
  external: ['react', 'react-dom', 'next'],
});

// Configuration for browser bundle (IIFE)
const browserConfig = defineConfig({
  entry: {
    browser: 'src/browser-entry.ts',
  },
  format: ['iife'],
  globalName: 'AgnoPay', // Exposed as window.AgnoPay
  dts: false, // Types not needed for browser bundle
  sourcemap: true,
  clean: false, // Don't clean (moduleConfig already does)
  bundle: true, // Bundle everything for browser
  minify: true, // Minify for production
  splitting: false,
  treeshake: true, // Tree-shake for smaller bundle size
  platform: 'browser',
  target: 'es2015', // Support older browsers
  outExtension() {
    return {
      js: '.global.js', // Output as browser.global.js
    };
  },
});

// Export both configurations
export default [moduleConfig, browserConfig];
