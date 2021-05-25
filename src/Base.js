//@ts-check
import Mim from './Mim.js'

/**
 * @typedef {Object} Payload
 * @prop {number} code
 * @prop {boolean} ok
 * @prop {Error | null} error
 * @prop {Headers | Object<string, string>} headers
 * @prop {string | import('stream')} [body]
 */

export default class Base {
  /** @type {Object<string, string>} */
  static HEADERS = { __proto__: null }

  /** @type {string} */
  static BASE_URL = 'http://localhost:3000'

  /** @type {string | *[]} */
  body = null

  /** @type {string} */
  method = 'GET'

  /** @type {Object<string, string>} */
  // @ts-ignore
  headers = { ...this.constructor.HEADERS }

  /** @alias headers */
  get head() {
    return this.headers
  }

  /** @alias headers */
  get header() {
    return this.headers
  }

  /**
   * @param {string} [method='GET']
   * @param {string | URL} [url]
   */
  constructor(method, url) {
    if (method) {
      this.method = method.toUpperCase()
    }
    //@ts-ignore
    this.url = this.constructor.resolveUrl(url)
  }

  /**
   * @param {string} key
   */
  has(key) {
    return key in this.headers
  }

  /**
   * @param {string} key
   */
  get(key) {
    return this.headers[ key ]
  }

  /**
   * @param {string} key
   * @param {string} val
   * @returns {Base}
   */
  set(key, val) {
    if (typeof key == 'object')
      Object.assign(this.headers, key)
    else
      this.headers[ key ] = val
    return this
  }

  /**
   * @param {string} [alias]
   * @returns {Base|string}
   */
  type(alias) {
    return alias
      ? this.set('content-type', Mim.get(alias))
      : this.get('content-type')
  }

  /**
   * @param {*} body
   * @returns {Base}
   */
  send(body) {
    if (body == null)
      return this
    if (typeof body == 'object') {
      this.headers[ 'content-type' ] ||= 'application/json'
      this.body = JSON.stringify(body)
    }
    else
      this.body = `${ body }`
    return this.set('content-length', String(this.body.length))
  }

  /**
   * @param {string | Object.<string, string>} key
   * @param {string} [val]
   * @returns {Base}
   */
  query(key, val) {
    if (!key)
      return this
    if (val == null && typeof key == 'object')
      Object.entries(key).forEach(([ k, v ]) =>
        this.url.searchParams.set(k, v))
    else
      this.url.searchParams.set(String(key), val)
    return this
  }

  /**
   * @param {any[]} a
   */
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

  /**
   * @param {string|URL} [url]
   */
  static resolveUrl(url) {
    return typeof url == 'string'
      ? /^https?:/i.test(url)
        ? new URL(url)
        : new URL(url, this.BASE_URL)
      : url instanceof URL
        ? url // @ts-ignore
        : new URL(this.BASE_URL)
  }

  /**
   * @param {string | URL} url
   * @param {any} body
   */
  static get(url, body) {
    return new this('get', url).query(body)
  }

  /**
   * @param {string | URL} url
   * @param {any} body
   */
  static put(url, body) {
    return new this('put', url).send(body)
  }

  /**
   * @param {string | URL} url
   * @param {any} body
   */
  static post(url, body) {
    return new this('post', url).send(body)
  }

  /**
   * @param {string | URL} url
   * @param {any} body
   */
  static del(url, body) {
    return new this('delete', url).send(body)
  }
}

