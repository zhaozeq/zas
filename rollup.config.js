import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const input = 'src/index.js'

export default [
  // ESM build(ES6)
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm'
    },
    plugins: [
      resolve(),
      babel({
        runtimeHelpers: true
      }),
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          // react: ['React'],
          // 'react-dom': [{ 'react-dom': 'unstable_batchedUpdates' }]
        }
      })
    ]
  },
  // CommonJS build(node)
  {
    input,
    output: {
      file: 'lib/log-tips.cjs.js',
      format: 'cjs'
    },
    plugins: [babel()]
  },
  // UMD: Production build(判断是否支持 AMD，判断是否支持 CommonJS，如果都没有 使用全局变量)
  {
    input,
    output: {
      file: 'lib/log-tips.js',
      format: 'umd',
      name: 'warning'
    },
    plugins: [
      // Setting development env before running babel etc
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      commonjs({
        namedExports: {
          react: ['React']
        }
      }),
      babel()
    ]
  },
  {
    input,
    output: {
      file: 'lib/log-tips.min.js',
      format: 'umd',
      name: 'warning'
    },
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      babel(),
      uglify()
    ]
  }
]
