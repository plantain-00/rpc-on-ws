import { Service, sleep } from 'clean-scripts'

const tsFiles = `"src/**/*.ts" "spec/**/*.ts" "demo/**/*.ts"`

export default {
  build: [
    `rimraf dist/`,
    {
      back: [
        'tsc -p src/tsconfig.nodejs.json',
        'api-extractor run --local'
      ],
      front: [
        `tsc -p src/tsconfig.browser.json`,
        `rollup --config rollup.config.mjs`
      ]
    }
  ],
  lint: {
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles}`,
    export: `no-unused-export ${tsFiles}`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src/tsconfig.nodejs.json --strict',
    typeCoverageBrowser: 'type-coverage -p src/tsconfig.browser.json --strict'
  },
  test: [
    'ava',
    new Service('ts-node demo/server.ts'),
    () => sleep(2000),
    'ts-node demo/client.ts'
  ],
  fix: `eslint --ext .js,.ts,.tsx ${tsFiles} --fix`
}
