const childProcess = require('child_process')
const { Service } = require('clean-scripts')
const util = require('util')

const execAsync = util.promisify(childProcess.exec)

module.exports = {
  build: [
    `rimraf dist/`,
    {
      back: `tsc -p src/tsconfig.nodejs.json`,
      front: [
        `tsc -p src/tsconfig.browser.json`,
        `rollup --config rollup.config.js`
      ]
    }
  ],
  lint: {
    ts: `tslint "src/*.ts" "spec/*.ts" "demo/*.ts"`,
    js: `standard "**/*.config.js"`,
    export: `no-unused-export "src/*.ts" "spec/*.ts" "demo/*.ts"`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    'tsc -p demo',
    new Service('node demo/server.js'),
    'node demo/client.js',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
  ],
  fix: {
    ts: `tslint --fix "src/*.ts" "spec/*.ts"`,
    js: `standard --fix "**/*.config.js"`
  },
  release: `clean-release`
}
