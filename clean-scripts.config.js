const childProcess = require('child_process')

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
    export: `no-unused-export "src/*.ts" "spec/*.ts"`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    'tsc -p demo',
    () => new Promise((resolve, reject) => {
      const server = childProcess.spawn('node', ['demo/server.js'])
      server.stdout.pipe(process.stdout)
      server.stderr.pipe(process.stderr)

      const client = childProcess.spawn('node', ['demo/client.js'])
      client.stdout.pipe(process.stdout)
      client.stderr.pipe(process.stderr)

      setTimeout(() => {
        server.kill('SIGINT')
        resolve()
      }, 2000)
    }),
    () => new Promise((resolve, reject) => {
      childProcess.exec('git status -s', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          if (stdout) {
            reject(new Error(`generated files doesn't match.`))
          } else {
            resolve()
          }
        }
      }).stdout.pipe(process.stdout)
    })
  ],
  fix: {
    ts: `tslint --fix "src/*.ts" "spec/*.ts"`,
    js: `standard --fix "**/*.config.js"`
  },
  release: `clean-release`
}
