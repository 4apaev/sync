import Mim from './util/mim.js'

export default class Base {
  static HEADERS = { __proto__: null }
  static BASE_URL = 'http://localhost:3000'

  body = null
  method = 'GET'
  headers = { ...this.constructor.HEADERS }
  url = new URL(this.constructor.BASE_URL)

  constructor(method, url) {
    if (method) {
      this.method = method.toUpperCase()
    }
    this.url = this.constructor.resolveUrl(url)
  }

  has(key) {
    return key in this.headers
  }

  get(key) {
    return this.headers[ key ]
  }

  set(key, val) {
    if ('object' === typeof key)
      Object.assign(this.headers, key)
    else
      this.headers[ key ] = val
    return this
  }

  type(alias) {
    return alias
      ? this.set('content-type', Mim.get(alias))
      : this.get('content-type')
  }

  send(body) {
    if (body == null)
      return this
    if ('object' === typeof body) {
      this.type() || this.type('json')
      this.body = JSON.stringify(body)
    } else
      this.body = `${ body }`
    return this.set('content-length', this.body.length)
  }

  query(key, val) {
    if (!key)
      return this

    if (val == null && 'object' === typeof key)
      Object.entries(key).forEach(([ k, v ]) =>
        this.url.searchParams.set(k, v))
    else
      this.url.searchParams.set(key, val)
    return this
  }

  then(...a) {
    return this.end({
      url: this.url,
      body: this.body,
      method: this.method,
      headers: this.headers,
    }).then(this.parse).then(...a)
  }

  async end(x) { return x }

  async parse(x) { return x }

  static resolveUrl(url) {
    return 'string' === typeof url
      ? /^https?:/i.test(url)
        ? new URL(url)
        : new URL(url, this.BASE_URL)
      : url instanceof URL
        ? url
        : new URL(this.BASE_URL)
  }

  static get(url, body) {
    return new this('get', url).query(body)
  }

  static put(url, body) {
    return new this('put', url).send(body)
  }

  static post(url, body) {
    return new this('post', url).send(body)
  }

  static del(url, body) {
    return new this('delete', url).send(body)
  }
}

