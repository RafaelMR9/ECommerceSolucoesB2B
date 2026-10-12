import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePassword } from '../src/utils/utils.js'

test('passwords enforce the length and letters described by the form', () => {
  for (const invalid of ['abc123', '12345678', '!!!!!!!!', '        ']) {
    assert.equal(validatePassword(invalid), false, invalid)
  }
  for (const valid of ['MinhaSenha1', 'Árvore2026', 'Safe-pass!']) {
    assert.equal(validatePassword(valid), true, valid)
  }
})
