import Http from 'http'

export default Http.createServer((rq, rs) => {
  rq.setEncoding('utf8')
  rs.setHeader('content-type', 'application/json')

  let { url, method, headers, message='ok', body='' } = rq

  if (url === '/json-fail') {
    rs.statusCode = 200
    return rs.end('<sdfsdfsdfsfsd>')
  }

  rq.on('data', x => body += x)
  rq.on('end', e => {
    body = parse(rq, body)
    if (e)
      console.log(
        'TEST SERVER ERROR',
         rs.statusCode = 500,
         message = e?.message ?? String(e))
    else
      rs.statusCode = 200

    rs.end(JSON.stringify({ url, method, headers, message, body }, 0, 2))
  })
})

function parse(rq, body) {
  const ct = rq?.headers?.[ 'content-type' ]
  const cl = rq?.headers?.[ 'content-length' ]|0
  const bl = body?.length|0

  // console.log('body-length', bl)
  // console.log('content-length', cl)
  // console.log('content-type', ct)

  if (bl && cl && ct === 'application/json') {
    try {
      return JSON.parse(body)
    } catch(e) {}
  }
  return body
}
