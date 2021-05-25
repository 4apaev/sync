import Http from 'http'
import Https from 'https'
import { Readable } from 'stream'
import { format, debuglog } from 'util'

import Base from './Base.js'
import Head from './Head.js'

const debug = debuglog('Sync.Node')

export default class Sync extends Base {
  send(body) {
    if (body == null)
      return this

    if (body instanceof Readable) {
      this.body = body
      return this
    }

    if (typeof body == 'object') {
      this.body = format('%j', body)
      this.headers[ 'content-type' ] ||= 'application/json'
    } else {
      this.body = format('%s', body)
    }
    return this.set('content-length', Buffer.byteLength(this.body))
  }

  end({ url, body, method, headers }) {
    return new Promise((done, fail) => {
      const agent = url.protocol === 'https:'
        ? Https
        : Http
      const rq = agent.request(url, { method, headers }, done)
      rq.once('error', fail)
      return body instanceof Readable
        ? body.pipe(rq)
        : rq.end(body)
    })
  }

  async parse(re) {
    const ok = re.statusCode < 400
    const code = re.statusCode
    const headers = new Head(re.headers)
    let body = []
    let error = null

    for await (const chunk of re)
      body.push(chunk)
    body = Buffer.concat(body).toString()

    if (headers.isJSON() && body.length) {
      try {
        body = JSON.parse(body)
      } catch (e) {
        error = e
        debug('Fail to parse %s', e.message)
      }
    }

    const payload = { ok, code, headers, body, error }
    return error || !ok
      ? Promise.reject(payload)
      : payload
  }

}