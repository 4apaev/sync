import Mim from './Mim.js'

export default class Head extends Map {
  constructor(o) {
    if (toString.call(o) === '[object Object]') {
      super(Object.entries(o))
    } else {
      super(o)
    }
  }

  set(k, v) {
    if ('string' === typeof k) {
      super.set(k, v)
    } else if (v == null && 'object' === typeof k) {
      for (const [ a, b ] of Object.entries(k)) {
        super.set(a, b)
      }
    }
    return this
  }

  type(v) {
    return v != null
      ? super.set('content-type', Mim.get(v))
      : this.get('content-type')
  }

  toJSON() {
    let h = { __proto__: null }
    for (const [ k, v ] of this) {
      h[ k ] = v
    }
    return h
  }

  isJSON() {
    return this.get('content-type') === Mim.mims.json
  }

  static isJSON(x) {
    return Mim.is(Mim.mims.json, x)
  }
}
