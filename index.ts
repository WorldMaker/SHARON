import * as Discord from 'discord.js'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Action, checkAll } from './actions/index.ts'
import { StoreFile } from './epics/storage.ts'
import rootEpic from './epics/index.ts'
import channelUpdate from './events/channel-update.ts'
import voiceStateUpdate from './events/voice-state-update.ts'
import reducer from './reducers/index.ts'
import { Store } from './models/store/index.ts'

const BotToken = Deno.env.get('BOT_TOKEN')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates
  ]
})

const epicMiddleware = createEpicMiddleware<Action, Action, Store>({
  dependencies: {
    client
  }
})

let baseState: any /* Store | undefined */ = undefined
try {
  const storeFile = await Deno.readTextFile(StoreFile)
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
Deno.addSignalListener('SIGINT', async () => {
  console.log('Logging out…')
  // TODO: Shutdown epics
  try {
    await client.destroy()
  } catch (err) {
    console.error('Error disconnecting', err)
  }
  console.log('Saving final state…')
  try {
    await Deno.writeTextFile(StoreFile, JSON.stringify(store.getState()), { create: true })
  } catch (err) {
    console.error('Error saving state', err)
  }
  // Ensure the process exits
  Deno.exit()
})
