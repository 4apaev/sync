// @ts-check
import Base from './Base.js'
import Mim from './Mim.js'


export default class Fetch extends Base {
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
    } catch (e) {
      payload.error = e
    }
    return re.ok
      ? payload
      : Promise.reject(payload)
  }
}

