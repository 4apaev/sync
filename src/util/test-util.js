import Http from 'http'

export default Http.createServer((rq, rs) => {
  rq.setEncoding('utf8')
  rs.setHeader('content-type', 'application/json')

  if (rq.url === '/json-fail') {
    rs.statusCode = 200
    return rs.end('<sdfsdfsdfsfsd>')
  }

  let body = ''

  const end = e => {
    if (e) {
      console.log('SRV ERR', e.message)
    }

    try {
      body = JSON.parse(body)
    } catch(_) {
    } finally {
      rs.statusCode = e != null ? 500 : 200
      rs.end(JSON.stringify({
        body,
        url: rq.url,
        method: rq.method,
        headers: rq.headers,
        message: e ? e.message : 'ok',
      }, 0, 2))
    }
  }

  rq.on('data', x => body += x)
  rq.on('error', end)
  rq.on('end', end)
})


