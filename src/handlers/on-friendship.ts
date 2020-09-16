import {
  Friendship,
  log,
  Wechaty,
}             from 'wechaty'
import { FriendshipType } from 'wechaty-puppet-padplus/dist/src/schemas'

export default async function onFriendship (
  this       : Wechaty,
  friendship : Friendship,
): Promise<void> {
  log.info('on-friendship', 'onFriendship(%s)', friendship)
  try {
    console.log(`received friend event.`)
    switch (friendship.type()) {

    // 1. New Friend Request

    case this.Friendship.Type.Receive:
      await friendship.accept()
      break

    // 2. Friend Ship Confirmed

    case this.Friendship.Type.Confirm:
      log.info('say hello to new friend ...')
      const friend = friendship.contact()
      await friend.ready()
      
      const helloMsg = 'hello I"m jiarui Li'
      friend.say(helloMsg)

      break
    }
  } catch (e) {
    console.error(e)
  }
}
