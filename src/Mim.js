export const mims = {
  __proto__: null,
  css: 'text/css',
  txt: 'text/plain',
  html: 'text/html',
  js: 'application/javascript',
  xml: 'application/xml',
  json: 'application/json',
  form: 'multipart/form-data',
  query: 'application/x-www-form-urlencoded',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
}

export const CT = 'content-type'

export default {
  mims,

  get(x) {
    return mims[ x ] || x
  },

  ext(x) {
    return mims[ x.split('.').pop() ] || mims.txt
  },

  is(x, head) {
    const ct = typeof head == 'string'
      ? head
      : head?.get?.('content-type') ?? head?.[ 'content-type' ] ?? ''
    return ct.toLowerCase().includes(mims[ x ] ?? x)
  },
}
