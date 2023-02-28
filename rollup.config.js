/*import sass from 'rollup-plugin-sass'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
    input: 'src/index.jsx',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        strict: false
      }
    ],
    plugins: [
      sass({ insert: true }),
      typescript({ objectHashIgnoreUnknownHack: true })
    ],
    external: ['react', 'react-dom']
  }
*/
import sass from 'rollup-plugin-sass'
//import serve from "rollup-plugin-serve";
//import livereload from "rollup-plugin-livereload";
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

import pkg from './package.json'

export default {
  input: "src/index.jsx",
  output: {
    file: pkg.main,
    format: "cjs",
    exports: 'named',
    sourcemap: true,
    strict: false
  },
  plugins: [
    nodeResolve({
      extensions: [".js"],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    babel({
      presets: ["@babel/preset-react"],
    }),
    commonjs(),
    sass({ insert: true }),
    /*serve({
      open: true,
      verbose: true,
      contentBase: ["", "public"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "dist" }),*/
  ],
  external: ['react','react-dom']
};