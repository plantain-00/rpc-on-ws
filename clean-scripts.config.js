const { Service, checkGitStatus } = require('clean-scripts')

const tsFiles = `"src/**/*.ts" "spec/**/*.ts" "demo/**/*.ts"`
const jsFiles = `"*.config.js"`

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
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    'tsc -p demo',
    new Service('node demo/server.js'),
    'node demo/client.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`
  },
  release: `clean-release`
}
