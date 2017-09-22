import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/index.js',
  name: 'WsRpc',
  plugins: [resolve(), uglify()],
  output: {
    file: 'dist/rpc-on-ws.min.js',
    format: 'umd'
  }
}
