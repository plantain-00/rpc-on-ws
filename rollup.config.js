import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/index.js',
  plugins: [resolve({ browser: true }), uglify()],
  output: {
    name: 'WsRpc',
    file: 'dist/rpc-on-ws.min.js',
    format: 'umd'
  }
}
