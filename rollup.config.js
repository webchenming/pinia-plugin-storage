import { defineConfig } from 'rollup'

import resolve from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: './dist/es/index.mjs',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: './dist/lib/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: './dist/index.js',
      format: 'iife',
      sourcemap: true,
      exports: 'named',
      name: 'PiniaPluginStorage',
      globals: {
        'pinia': 'Pinia',
        'lodash-es': 'LodashEs',
      },
    },
  ],
  plugins: [
    resolve({ extensions: ['.ts'] }),
    externals({ devDeps: false }),
    typescript(),
    terser(),
  ],
})
