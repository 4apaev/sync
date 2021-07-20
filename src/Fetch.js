// @ts-check
import Base from './Base.js'
import Mim, {
  mims,
} from './Mim.js'

export default class Fetch extends Base {
  static BASE_URL = location.origin

  /**
   * @prop {string | URL} url
   * @prop {string} method
   * @prop {Headers | Object<string, string>} headers
   * @prop {*} [body]
   * @return {Promise<Response>}
   */
  end({ url, body, method, headers }) {
    return fetch(url, { body, method, headers })
  }

  /**
   * @param {Response} re
   * @return {Promise<import('./Base.js').Payload>}
   */
  async parse(re) {
    const payload = {
      ok: re.ok,
      code: re.status,
      headers: re.headers,
      error: null,
      body: null,
    }
    try {
      payload.body = Mim.is('json', re.headers)
        ? await re.json()
        : await re.text()
    }
    catch (e) {
      payload.error = e
    }
    return re.ok
      ? payload
      : Promise.reject(payload)
  }

  /**
   * @param {string} url
   */
  jsonp(url) {
    return new Promise((done, fail) => {
      const id = 'jsonp-' + Math.random().toString(32).slice(2)
      // const rq = Fetch.get(url, { callback: id })
      const scr = document.createElement('script')
      const headers = new Headers([[ 'content-type', mims.js ]])

      const clear = (fn, payload) => {
        scr.onerror = null,
        delete globalThis[ id ]
        document.head.removeChild(scr)
        fn(payload)
      }

      globalThis[ id ] = body =>
        clear(done, { ok: true, code: 200, headers, error: null, body })

      scr.onerror = e =>
        clear(fail, { ok: false, code: 404, headers, error: e, body: null })

      scr.id = id
      scr.src = url
      document.head.appendChild(scr)
    })
  }
}

