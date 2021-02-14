import assert from 'assert'
import { Readable } from 'stream'

import Sync from '../src/Sync.js'
import Server from '../scripts/test-util.js'

const PORT = 7654
const URL = `http://localhost:${ PORT }`

const baseMethod = m => {
  const method = { get:'GET', put:'PUT', post:'POST', del:'DELETE' }[ m ]

  it(`no body`, async () => {
    const re = await Sync[ m ](URL)
    assert.strictEqual(re.code, 200)
    assert.strictEqual(re.body.url, '/')
    assert.strictEqual(re.body.body, '')
    assert.strictEqual(re.body.method, method)
    assert.strictEqual(re.body.headers[ 'content-type' ], undefined)
  })

  it(`send body as second argument`, async () => {
    const body = { a:1 }
    const re = await Sync[ m ](URL, body)
    assert.strictEqual(re.code, 200)
    assert.strictEqual(re.body.url, '/')
    assert.strictEqual(re.body.method, method)
    assert.strictEqual(re.body.headers[ 'content-type' ], 'application/json')
    assert.deepStrictEqual(re.body.body, body)
  })

  it(`send body as method`, async () => {
    const body = { a:1 }
    const re = await Sync[ m ](URL).send(body)
    assert.strictEqual(re.code, 200)
    assert.strictEqual(re.body.url, '/')
    assert.strictEqual(re.body.method, method)
    assert.strictEqual(re.body.headers[ 'content-type' ], 'application/json')
    assert.deepStrictEqual(re.body.body, body)
  })

  it(`set head`, async () => {
    let k = 'x-head'
    let v = 'qwerty'
    const re = await Sync[ m ](URL).set(k, v)
    assert.strictEqual(re.code, 200)
    assert.strictEqual(re.body.url, '/')
    assert.strictEqual(re.body.method, method)
    assert.strictEqual(re.body.headers[ k ], v)
  })
}

describe('Sync', () => {
  Sync.BASE_URL = URL

  before(() => Server.listen(PORT))
  after(() => Server.close())

  describe('new Sync', () => {
    it('should set method to GET if not specified', async () => {
      const re = await new Sync
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should set method to GET', async () => {
      const re = await new Sync('GET')
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should stringify body object and set content-type to json', async () => {
      const rq = new Sync('GET')
      const body = { a:1 }
      assert.strictEqual(rq, rq.send(body))
      assert.strictEqual(rq.type(), 'application/json')
      assert.strictEqual(rq.body, JSON.stringify(body))
    })
  })

  describe('Sync.GET', () => {
    it('Sync.get should set method to GET', async () => {
      const re = await Sync.get()
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should set query params', async () => {
      const re = await Sync.get().query({ a: 1 })
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/?a=1')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should merge query params', async () => {
      const re = await Sync.get('/?a=1').query({ b: 2 })
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/?a=1&b=2')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should not throw when send empty body', async () => {
      const re = await Sync.get().send()
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
    })

    it('should set content-type to json', async () => {
      const re = await Sync.get('/api').type('json')
      assert.strictEqual(re.code, 200)
      assert.strictEqual(re.body.url, '/api')
      assert.strictEqual(re.body.body, '')
      assert.strictEqual(re.body.method, 'GET')
      assert.strictEqual(re.body.headers[ 'content-type' ], 'application/json')
    })
  })

  describe('Sync.send', () => {
    it('should stringify and set body', () => {
      const rq = Sync.del()
      rq.send(true)
      assert.strictEqual(rq.body, 'true')
      assert.strictEqual(rq.get('content-length'), 4)
      rq.send(123)
      assert.strictEqual(rq.body, '123')
      assert.strictEqual(rq.get('content-length'), 3)
      rq.send()
      assert.strictEqual(rq.body, '123')
      assert.strictEqual(rq.get('content-length'), 3)
    })

    it('should set body and update content-type', () => {
      const rq = Sync.del()
      rq.send({ a: 1 })
      assert.strictEqual(rq.body, '{"a":1}')
      assert.strictEqual(rq.type(), 'application/json')
      assert.strictEqual(rq.get('content-length'), 7)
    })

    it('should not update content-type if exist', () => {
      const rq = Sync.del()
      rq.type('xml')
      rq.send({ a: 1 })
      assert.strictEqual(rq.body, '{"a":1}')
      assert.strictEqual(rq.type(), 'application/xml')
      assert.strictEqual(rq.get('content-length'), 7)
    })
  })

  it('should fail on JSON.parse due SyntaxError', async () => {
    await assert.rejects(async () => {
      await Sync.get('/json-fail')
    })
  })

  it(`should send body as stream`, async () => {
    const readable = Readable.from((async function* () {
      yield 's'
      yield 'h'
      yield 'o'
      yield 's'
      yield 'h'
      yield 'a'
      yield 'n'
      yield 'a'
    })())

    const re = await Sync.post('/', readable)
    assert.strictEqual(re.code, 200)
    assert.strictEqual(re.body.body, 'shoshana')
  })

  describe('PUT', () => baseMethod('put'))
  describe('POST', () => baseMethod('post'))

})
