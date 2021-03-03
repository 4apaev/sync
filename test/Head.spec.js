import {
  strictEqual,
  deepStrictEqual,
} from 'assert'

import Mim from '../src/Mim.js'
import Head from '../src/Head.js'

describe('Mim', () => {
  it('get', () => {
    strictEqual(Mim.get('css'), 'text/css')
    strictEqual(Mim.get('js'), 'application/javascript')
    strictEqual(Mim.get('yml'), 'yml')
  })

  it('ext', () => {
    strictEqual(Mim.ext('style.css'), 'text/css')
    strictEqual(Mim.ext('script.js'), 'application/javascript')
    strictEqual(Mim.ext('config.yml'), 'text/plain')
  })
})

describe('Head', () => {
  const ct = 'content-type'
  const json = 'application/json'

  it('should construct head from object', () => {
    const h = {
      a: 'A',
      b: 'B',
    }
    const head = new Head(h)
    strictEqual(head.get('a'), h.a)
    strictEqual(head.get('b'), h.b)
    strictEqual(head.size, 2)
  })

  it('should construct head from entries', () => {
    const h = [
      [ 'a', 'A' ],
      [ 'b', 'B' ],
    ]
    const head = new Head(h)
    strictEqual(head.get('a'), h[ 0 ][ 1 ])
    strictEqual(head.get('b'), h[ 1 ][ 1 ])
    strictEqual(head.size, 2)
  })

  it('get/set', () => {
    const head = new Head
    strictEqual(head.set('a', 'b'), head)
    strictEqual(head.get('a'), 'b')
  })

  it('should set content-type with alias', () => {
    const h = new Head
    h.type('json')
    strictEqual(h.type(), json)
    strictEqual(h.get(ct), json)
  })

  it('should set content-type', () => {
    const h = new Head
    h.set(ct, json)
    strictEqual(h.type(), json)
    strictEqual(h.get(ct), json)
  })

  it('should set with object', () => {
    const h = new Head
    h.set({ 'a': 1, 'b': 2 })
    strictEqual(h.get('a'), 1)
    strictEqual(h.get('b'), 2)
  })

  it('should return plain object', () => {
    const h = new Head
    h.type('query')
    deepStrictEqual(h.toJSON(), {
      __proto__: null,
      'content-type': 'application/x-www-form-urlencoded'
    })
  })

  it('isJSON', () => {
    const h = new Head
    strictEqual(h.isJSON(), false)
    h.type('json')
    strictEqual(h.isJSON(), true)
  })

  it('static isJSON', () => {
    const h = new Head({ [ ct ]: json })

    strictEqual(Head.isJSON(h), true)
    strictEqual(Head.isJSON(h.toJSON()), true)
    strictEqual(Head.isJSON(json), true)

    h.type('html')

    strictEqual(Head.isJSON(h), false)
    strictEqual(Head.isJSON(h.toJSON()), false)
    strictEqual(Head.isJSON('text/html'), false)

    strictEqual(Head.isJSON(), false)
    strictEqual(Head.isJSON(''), false)
    strictEqual(Head.isJSON({ }), false)
  })
})

