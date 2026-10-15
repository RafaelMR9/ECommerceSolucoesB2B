import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'

const frontend = fileURLToPath(new URL('../', import.meta.url))
const directory = mkdtempSync(join(tmpdir(), 'ecommerce-lint-'))
const fixture = join(directory, 'page.jsx')

after(() => rmSync(directory, { recursive: true, force: true }))

function lint(source) {
  writeFileSync(fixture, source)
  const result = spawnSync(
    process.execPath,
    [
      join(frontend, 'node_modules/oxlint/bin/oxlint'),
      '--config',
      join(frontend, '.oxlintrc.json'),
      '--deny-warnings',
      '--format=json',
      fixture,
    ],
    { cwd: frontend, encoding: 'utf8' }
  )
  assert.ifError(result.error)
  assert.equal(result.stderr, '')
  const report = JSON.parse(result.stdout)
  assert.equal(report.number_of_files, 1)
  return { status: result.status, diagnostics: report.diagnostics }
}

test('lint accepts valid React, Next images and browser and server globals', () => {
  const result = lint(`
    import Image from 'next/image'
    import { useEffect } from 'react'
    export default function Page({ name }) {
      useEffect(() => { document.title = name }, [name])
      return <Image src='/test.png' alt={name} width={20} height={20} data-env={process.env.NODE_ENV} />
    }
  `)
  assert.equal(result.status, 0)
  assert.deepEqual(result.diagnostics, [])
})

const invalidSources = [
  ['eslint(no-undef)', `export default function Page() { return <p>{missingValue}</p> }`],
  [
    'eslint(no-unused-vars)',
    `export default function Page() { const unused = 1; return <p>OK</p> }`,
  ],
  [
    'react-hooks(rules-of-hooks)',
    `import {useState} from 'react'; export default function Page({active}) { if(active) useState(0); return null }`,
  ],
  [
    'react-hooks(exhaustive-deps)',
    `import {useEffect} from 'react'; export default function Page({name}) { useEffect(() => { document.title = name }, []); return null }`,
  ],
  [
    'react(immutability)',
    `export default function Page({product}) { product.name = 'Changed'; return <p>{product.name}</p> }`,
  ],
  [
    'jsx-a11y(alt-text)',
    `import Image from 'next/image'; export default function Page() { return <Image src='/test.png' width={20} height={20} /> }`,
  ],
  [
    'jsx-a11y(aria-props)',
    `export default function Page() { return <button aria-labl='Submit'>Submit</button> }`,
  ],
  [
    'next(no-sync-scripts)',
    `export default function Page() { return <script src='/script.js' /> }`,
  ],
  [
    'next(no-html-link-for-pages)',
    `export default function Page() { return <a href='/categories'>Categories</a> }`,
  ],
]

for (const [rule, source] of invalidSources) {
  test(`lint rejects ${rule}`, () => {
    const result = lint(source)
    assert.equal(result.status, 1)
    assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === rule))
  })
}
