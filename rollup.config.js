import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'commonjs',
  },
  plugins: [typescript()],
  external: ['google-spreadsheet', 'util'],
};

export default options;
