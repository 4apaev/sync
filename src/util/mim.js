export const mims = {
  __proto__: null,
  css  : 'text/css',
  txt  : 'text/plain',
  html : 'text/html',
  js   : 'application/javascript',
  xml  : 'application/xml',
  json : 'application/json',
  form : 'multipart/form-data',
  query: 'application/x-www-form-urlencoded',
  bdf: 'application/x-font-bdf',
  otf: 'application/x-font-otf',
  ttf: 'application/x-font-ttf',
  woff: 'application/font-woff',
  woff2: 'application/font-woff2',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
}

export default {
  mims,

  get(x) {
    return mims[ x ] || x
  },

  ext(x) {
    return typeof x === 'string'
      ? mims[ x.split('.').pop() ] || mims.txt
      : mims.txt
  },

  is(x, head) {
    if (!x || !head)
      return false

    const ct = 'string' === typeof head
      ? head
      : head.get
        ? head.get('content-type')
        : head[ 'content-type' ]
    return !!ct && ct.toLowerCase().includes(mims[ x ] || x)
  }
}