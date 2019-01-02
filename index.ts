import * as Discord from 'discord.js'
import { promises as fs } from 'fs'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { from } from 'rxjs'
import { throttleTime, concatMap, catchError } from 'rxjs/operators'
import { closedFleet, newFleet, changedShip, droppedShip, addedShip, joinedShip, leftShip } from './actions'
import rootEpic from './epics'
import { ChannelType, getChannelInfo, getFleetInfo, getPlayerInfo } from './model'
import reducer from './reducer'
import { BotToken } from './secrets.json'
import { Store } from './store'
import { toObservable } from './util/redux'

const StoreFile = 'store.json'

async function main () {
  const client = new Discord.Client()

  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      client
    }
  })

  let baseState: Store | undefined = undefined
  try {
    const storeFile = await fs.readFile(StoreFile, { encoding: 'utf-8' })
    if (typeof storeFile === 'string') {
      baseState = JSON.parse(storeFile)
    }
  } catch (err) {
    console.warn('No previous state', err)
  }

  const store = createStore(reducer, baseState, applyMiddleware(epicMiddleware))

  const store$ = toObservable(store)

  const storage = store$.pipe(
    throttleTime(5 /* m */ * 60 /* s */ * 1000 /* ms */), // no more than once every 5 minutes
    concatMap(state => from(fs.writeFile(StoreFile, JSON.stringify(state), { encoding: 'utf-8' }))),
    catchError((err, caught) => {
      console.error('Error saving state', err)
      return caught // retry
    })
  )
    .subscribe(undefined, (err: any) => console.error(err), () => console.log('Stopped saving store'))

  client.on('error', err => {
    console.error(err)
  })

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on('channelUpdate', async (oldChannel, newChannel) => {
    const oldInfo = getChannelInfo(oldChannel)
    const newInfo = getChannelInfo(newChannel)
    if (oldInfo && oldInfo.type === ChannelType.Fleet) {
      store.dispatch(closedFleet(oldInfo))
    }
    if (newInfo && newInfo.type === ChannelType.Fleet) {
      store.dispatch(newFleet(newInfo))
    }
    if (oldInfo && oldInfo.type === ChannelType.Ship && (!newInfo || newInfo.type !== ChannelType.Ship)) {
      const fleet = getFleetInfo((oldChannel as Discord.GuildChannel).parent)
      store.dispatch(droppedShip(fleet, oldInfo))
    }
    if (newInfo && newInfo.type === ChannelType.Ship && (!oldInfo || oldInfo.type !== ChannelType.Ship)) {
      const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
      store.dispatch(addedShip(fleet, newInfo))
    }
    if (oldInfo && newInfo && oldInfo.type === ChannelType.Ship && newInfo.type === ChannelType.Ship) {
      const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
      store.dispatch(changedShip(fleet, oldInfo, newInfo))
    }
  })

  client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (oldMember && oldMember.voiceChannel) {
      const oldInfo = getChannelInfo(oldMember.voiceChannel)
      const oldFleet = getFleetInfo(oldMember.voiceChannel.parent)
      if (oldInfo && oldInfo.type === ChannelType.Ship) {
        const oldPlayer = getPlayerInfo(oldFleet, null, oldMember)
        store.dispatch(leftShip(oldFleet, oldInfo, oldPlayer))
      }
    }
    if (newMember && newMember.voiceChannel) {
      const newInfo = getChannelInfo(newMember.voiceChannel)
      const newFleet = getFleetInfo(newMember.voiceChannel.parent)
      if (newInfo && newInfo.type === ChannelType.Ship) {
        const newPlayer = getPlayerInfo(newFleet, newInfo, newMember)
        store.dispatch(joinedShip(newFleet, newInfo, newPlayer))
      }
    }
  })

  await client.login(BotToken)

  epicMiddleware.run(rootEpic as any) // TODO: Why the type conflict?

  // Try to cleanly disconnect
  process.on('SIGINT', () => {
    console.log('Logging out…')
    storage.unsubscribe()
    client.destroy()
      .catch(err => console.error(err))
    fs.writeFile(StoreFile, JSON.stringify(store.getState()), { encoding: 'utf-8' })
      .catch(err => console.error('Error saving store', err))
  })
}

main()
  .catch(err => console.error(err))
