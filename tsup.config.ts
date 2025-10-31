import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    config: 'src/config.ts',
    server: 'src/server.ts',
    types: 'src/types.ts',
    'client-hooks': 'src/client-hooks.ts',
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
