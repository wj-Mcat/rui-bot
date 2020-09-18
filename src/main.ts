// import './config'

// import {
//   log,
// }                     from 'wechaty'

// import { getWechaty } from './wechaty/mod'
// import { startWeb }   from './web/mod'

// async function main () {
//   log.verbose('main', 'main()')

//   const name = process.env.WECHATY_NAME || 'heroku-wechaty'

//   const bot = getWechaty(name)
// //   await bot.start()

//   await Promise.all([
//     bot.start(),
//     startWeb(bot),
//   ])

//   /**
//    * Do not return until the bot turned off
//    */
//   await bot.state.ready('off')

//   return 0
// }

// main()
//   .then(process.exit)
//   .catch((e) => {
//     log.error('Main', 'main() rejection: %s', e)
//     process.exit(1)
//   })

/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  EventLogoutPayload,
  EventLoginPayload,
  EventScanPayload,
  EventErrorPayload,
  EventMessagePayload,
  ImageType,
}                         from 'wechaty-puppet'

import { PuppetOA } from 'wechaty-puppet-official-account'

/**
 *
 * 1. Declare your Bot!
 *
 */
const puppet = new PuppetOA({
  appId: 'wxbd801c28fbe1bbbd',
  appSecret: '6959408a3ba1c82db1a11d941df65764',
  token: "token",
  port: 8080
//   webhookProxyUrl: "http://6ba5cd5520d7.ngrok.io",
})

/**
 *
 * 2. Register event handlers for Bot
 *
 */
puppet
  .on('logout', onLogout)
  .on('login',  onLogin)
  .on('scan',   onScan)
  .on('error',  onError)
  .on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
puppet.start()
  .catch(async e => {
    console.error('Bot start() fail:', e)
    await puppet.stop()
    process.exit(-1)
  })

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan (payload: EventScanPayload) {
  if (payload.qrcode) {
    // Generate a QR Code online via
    // http://goqr.me/api/doc/create-qr-code/
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(payload.qrcode),
    ].join('')
    console.info(`[${payload.status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
  } else {
    console.info(`[${payload.status}]`)
  }
}

function onLogin (payload: EventLoginPayload) {
  console.info(`${payload.contactId} login`)
  puppet.messageSendText(payload.contactId, 'Wechaty login').catch(console.error)
}

function onLogout (payload: EventLogoutPayload) {
  console.info(`${payload.contactId} logouted`)
}

function onError (payload: EventErrorPayload) {
  console.error('Bot error:', payload.data)
  /*
  if (bot.logonoff()) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (payload: EventMessagePayload) {
  const msgPayload = await puppet.messagePayload(payload.messageId)
  console.info('onMessage:', JSON.stringify(msgPayload))

  if (/ding/i.test(msgPayload.text || '')) {
    await puppet.messageSendText(msgPayload.fromId!, 'dong')
  }else if(/image/i.test(msgPayload.text || '')) {
    await puppet.messageImage("ss", ImageType.Artwork)
  }
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
Puppet Version: ${puppet.version()}

Please wait... I'm trying to login in...

`
console.info(welcome)
