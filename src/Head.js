//@ts-check
import Mim from './Mim.js'

export default class Head extends Map {
  /**
   * @param {Object<string, string>} [o]
   */
  constructor(o) {
    if (toString.call(o) == '[object Object]')
      super(Object.entries(o))
    else
      //@ts-ignore
      super(o)
  }

  /**
   * @param {string | Object<string, string>} k
   * @param {string} v
   */
  set(k, v) {
    if (typeof k == 'string')
      super.set(k, v)
    else if (v == null && typeof k == 'object')
      for (const [ a, b ] of Object.entries(k))
        super.set(a, b)
    return this
  }

  /**
   * @param {string} [v]
   * @return {Head|string|null}
   */
  type(v) {
    return v != null
      ? super.set('content-type', Mim.get(v))
      : this.get('content-type')
  }

  /**
   * @return {Object<string, string>}
   */
  toJSON() {
    let h = { __proto__: null }
    // @ts-ignore
    for (const [ k, v ] of this)
      h[ k ] = v
    return h
  }

  /**
   * @return {boolean}
   */
  isJSON() {
    return this.get('content-type') === Mim.mims.json
  }

  /**
   * @param {*} x
   * @return {boolean}
   */
  static isJSON(x) {
    return Mim.is(Mim.mims.json, x)
  }
}
