import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'dist/browser/index.js',
  dest: 'dist/rpc-on-ws.min.js',
  format: 'umd',
  moduleName: 'WsRpc',
  plugins: [resolve(), uglify()]
}
