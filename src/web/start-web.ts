import Hapi    from '@hapi/hapi'
import {
  Wechaty,
  log,
}               from 'wechaty'

import {
  PORT,
  VERSION,
}             from '../config'

export async function startWeb (bot: Wechaty): Promise<void> {
  log.verbose('startWeb', 'startWeb(%s)', bot)

  let qrcodeValue : undefined | string
  let userName    : undefined | string

  const server =  new Hapi.Server({
    port: 80,
    host: '0.0.0.0'
  })

  function isFromWeixinAuth(req: any): boolean{
    // test the request is from weixin authentication
    console.log(req.query)
    const {signature, timestamp, echostr} = req.query

    if (signature != null && timestamp != null && echostr != null){
      return true
    }
    return false
  }

  const handler = (request: any, _: any): string | void => {
    if (isFromWeixinAuth(request)){
      return request.query.echostr
    }
    else if (qrcodeValue) {
      const html = [
        `<h1>Heroku Wechaty Getting Started v${VERSION}</h1>`,
        'Scan QR Code: <br />',
        qrcodeValue + '<br />',
        '\n\n',
        'https://wechaty.github.io/qrcode/',
        encodeURIComponent(qrcodeValue),
      ].join('')
      return html
    } else if (userName) {
      return `Heroku Wechaty Getting Started v${VERSION} User ${userName} logged in`
    } else {
      return `Heroku Wechaty Getting Started v${VERSION} Hello, come back later please.`
    }
  }

  server.route({
    handler,
    method : 'GET',
    path   : '/',
  })

  bot.on('scan', qrcode => {
    qrcodeValue = qrcode
    userName    = undefined
  })
  bot.on('login', user => {
    qrcodeValue = undefined
    userName    = user.name()
  })
  bot.on('logout', () => {
    userName = undefined
  })

  await server.start()
  log.info('startWeb', 'startWeb() listening to http://localhost:%d', PORT)
}
