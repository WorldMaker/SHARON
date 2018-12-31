import * as Discord from 'discord.js'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { closedFleet, newFleet, changedShip, droppedShip, addedShip, joinedShip, leftShip } from './actions'
import rootEpic from './epics'
import { ChannelType, getChannelInfo, getFleetInfo, getPlayerInfo } from './model'
import reducer from './reducer'
import { BotToken } from './secrets.json'

const client = new Discord.Client()

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    client
  }
})

const store = createStore(reducer, applyMiddleware(epicMiddleware))

epicMiddleware.run(rootEpic as any) // TODO: Why the type conflict?

// TEMPORARY: Log SHARON's memory to console
store.subscribe(() => console.log(JSON.stringify(store.getState())))

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
    const oldPlayer = getPlayerInfo(oldMember)
    const oldInfo = getChannelInfo(oldMember.voiceChannel)
    const oldFleet = getFleetInfo(oldMember.voiceChannel.parent)
    if (oldInfo && oldInfo.type === ChannelType.Ship) {
      store.dispatch(leftShip(oldFleet, oldInfo, oldPlayer))
    }
  }
  if (newMember && newMember.voiceChannel) {
    const newPlayer = getPlayerInfo(newMember)
    const newInfo = getChannelInfo(newMember.voiceChannel)
    const newFleet = getFleetInfo(newMember.voiceChannel.parent)
    if (newInfo && newInfo.type === ChannelType.Ship) {
      store.dispatch(joinedShip(newFleet, newInfo, newPlayer))
    }
  }
})

client.login(BotToken)
  .catch(err => console.error('Error logging in', err))

// Try to cleanly disconnect
process.on('SIGINT', () => {
  console.log('Logging out…')
  client.destroy()
    .catch(err => console.error(err))
})
