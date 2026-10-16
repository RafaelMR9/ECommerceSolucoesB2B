import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePassword } from '../src/utils/utils.js'

test('senhas respeitam os requisitos de tamanho e letras informados no formulário', () => {
  for (const invalid of ['abc123', '12345678', '!!!!!!!!', '        ']) {
    assert.equal(validatePassword(invalid), false, invalid)
  }
  for (const valid of ['MinhaSenha1', 'Árvore2026', 'Safe-pass!']) {
    assert.equal(validatePassword(valid), true, valid)
  }
})
