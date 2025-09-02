import * as Discord from 'discord.js'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Action, checkAll } from './actions/index.ts'
import { StoreFile } from './epics/storage.ts'
import rootEpic from './epics/index.ts'
import channelUpdate from './events/channel-update.ts'
import voiceStateUpdate from './events/voice-state-update.ts'
import reducer from './reducers/index.ts'
import { initialState, Store } from './models/store/index.ts'

const BotToken = Deno.env.get('BOT_TOKEN')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
})

let baseState: Store = initialState
try {
  const storeFile = await Deno.readTextFile(StoreFile)
  if (typeof storeFile === 'string') {
    baseState = JSON.parse(storeFile) as Store
  }
} catch (err) {
  console.warn('No previous state', err)
}

client.on('error', (err) => console.error(err))
const readyPromise = new Promise<Discord.Client<true>>((resolve) => {
  client.on('clientReady', (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`)
    resolve(readyClient)
  })
})
client.on(
  'channelUpdate',
  (oldChannel, newChannel) =>
    channelUpdate(store.dispatch, oldChannel, newChannel),
)
client.on(
  'voiceStateUpdate',
  (oldMember, newMember) =>
    voiceStateUpdate(store.dispatch, oldMember, newMember),
)

await client.login(BotToken)

const readyClient = await readyPromise

const epicMiddleware = createEpicMiddleware<Action, Action, Store>({
  dependencies: {
    client: readyClient,
  },
})

const store = createStore(reducer, baseState, applyMiddleware(epicMiddleware))

await readyClient.user.setPresence({
  activities: [{ name: 'ALL THE SHIPS', type: Discord.ActivityType.Watching }],
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
    await Deno.writeTextFile(StoreFile, JSON.stringify(store.getState()), {
      create: true,
    })
  } catch (err) {
    console.error('Error saving state', err)
  }
  // Ensure the process exits
  Deno.exit()
})
