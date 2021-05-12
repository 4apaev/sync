import assert from 'assert'
import Base from '../src/Base.js'

describe('Base', () => {
  Base.BASE_URL = 'http://0.0.0.0/'

  describe('Base.resolveUrl', () => {
    it('should set default method', () => {
      assert.strictEqual(new Base().method, 'GET')
      assert.strictEqual(new Base('PUT').method, 'PUT')
      assert.strictEqual(Base.post().method, 'POST')
      assert.strictEqual(Base.del().method, 'DELETE')
    })

    it('should set default base url', () => {
      assert.strictEqual(Base.put(1).url.toString(), Base.BASE_URL)
    })

    it('should set url as URL', () => {
      const u = new URL('http://example.com')
      assert.strictEqual(Base.put(u).url, u)
    })

    it('should ignore base url when protocol specified', () => {
      const u = 'http://1.1.1.1/'
      assert.strictEqual(Base.put(u).url.toString(), u)
    })

    it('should use base url and path', () => {
      const u = 'api'
      assert.strictEqual(Base.put(u).url.toString(), Base.BASE_URL + u)
    })
  })

  describe('Base.headers', () => {
    it('should set headers as object and key/value', () => {
      assert.deepStrictEqual(Base.put().set('a', 'b').set({ c: 'd' }).headers, { a: 'b', c: 'd' })
    })

    it('should get header', () => {
      assert.strictEqual(Base.put().set('a', 'b').get('a'), 'b')
    })

    it('should check if header exist', () => {
      const rq = Base.put().set('a', 'b')
      assert.strictEqual(rq.has('a'), true)
      assert.strictEqual(rq.has('b'), false)
    })
  })

  describe('Base.send', () => {
    it('should stringify and set body', () => {
      const rq = Base.put()
      rq.send(true)
      assert.strictEqual(rq.body, 'true')
      assert.strictEqual(rq.get('content-length'), '4')
      rq.send(123)
      assert.strictEqual(rq.body, '123')
      assert.strictEqual(rq.get('content-length'), '3')
      rq.send()
      assert.strictEqual(rq.body, '123')
      assert.strictEqual(rq.get('content-length'), '3')
    })

    it('should set body and update content-type', () => {
      const rq = Base.put()
      rq.send({ a: 1 })
      assert.strictEqual(rq.body, '{"a":1}')
      assert.strictEqual(rq.type(), 'application/json')
      assert.strictEqual(rq.get('content-length'), '7')
    })

    it('should not update content-type if exist', () => {
      const rq = Base.put()
      rq.type('xml')
      rq.send({ a: 1 })
      assert.strictEqual(rq.body, '{"a":1}')
      assert.strictEqual(rq.type(), 'application/xml')
      assert.strictEqual(rq.get('content-length'), '7')
    })
  })

  describe('Base.query', () => {
    it('should ignore query params if empty', () => {
      const rq = Base.get()
      rq.query()
      assert.strictEqual(rq.url.toString(), Base.BASE_URL)
    })

    it('should set query params as key/value', () => {
      const rq = Base.get()

      rq.query('a', 'b')
      assert.strictEqual(rq.url.search, '?a=b')

      rq.query('c', 'd')
      assert.strictEqual(rq.url.search, '?a=b&c=d')
    })

    it('should set query params as object', () => {
      const rq = Base.get()

      rq.query({ a: 'b' })
      assert.strictEqual(rq.url.search, '?a=b')

      rq.query({ c: 'd' })
      assert.strictEqual(rq.url.search, '?a=b&c=d')
    })

  })

  describe('Base.then', () => {
    it('should then', async () => {
      const rq = Base.post('api')
      const rs = await rq
      assert.deepStrictEqual(rs, {
        url: rq.url,
        body: rq.body,
        method: rq.method,
        headers: rq.headers,
      })
    })
  })
})
