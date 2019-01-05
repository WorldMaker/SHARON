import * as Discord from 'discord.js'
import { promises as fs } from 'fs'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Action, checkAll } from './actions'
import { StoreFile } from './epics/storage'
import rootEpic from './epics'
import channelUpdate from './events/channel-update'
import voiceStateUpdate from './events/voice-state-update'
import reducer from './reducers'
import { BotToken } from './secrets.json'
import { Store } from './models/store'

async function main () {
  const client = new Discord.Client()

  const epicMiddleware = createEpicMiddleware<Action, Action, Store>({
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

  client.on('error', err => console.error(err))
  client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`))
  client.on('channelUpdate', (oldChannel, newChannel) => channelUpdate(store.dispatch, oldChannel, newChannel))
  client.on('voiceStateUpdate', (oldMember, newMember) => voiceStateUpdate(store.dispatch, oldMember, newMember))

  await client.login(BotToken)
  await client.user.setPresence({
    game: { name: 'ALL THE SHIPS', type: 'WATCHING' }
  })

  epicMiddleware.run(rootEpic)

  store.dispatch(checkAll())

  // Try to cleanly disconnect
  process.on('SIGINT', async () => {
    console.log('Logging out…')
    // TODO: Shutdown epics
    try {
      await client.destroy()
    } catch (err) {
      console.error('Error disconnecting', err)
    }
    console.log('Saving final state…')
    try {
      await fs.writeFile(StoreFile, JSON.stringify(store.getState()), { encoding: 'utf-8' })
    } catch (err) {
      console.error('Error saving state', err)
    }
    // Ensure the process exits
    process.exit()
  })
}

main()
  .catch(err => console.error(err))
