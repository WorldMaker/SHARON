import * as Discord from 'discord.js'
import { createStore } from 'redux'
import { closedFleet, newFleet, changedShip, droppedShip, addedShip, joinedShip, leftShip } from './actions'
import { ChannelType, getChannelInfo, getFleetInfo, getPlayerInfo } from './model'
import reducer from './reducer'
import { BotToken } from './secrets.json'

const client = new Discord.Client()

const store = createStore(reducer)

// TEMPORARY: Log SHARON's memory to console
store.subscribe(() => console.log(JSON.stringify(store.getState())))

client.on('error', err => {
  console.error(err)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

async function log (item: Discord.Channel | Discord.GuildMember | null, message: string) {
  if (item && (item instanceof Discord.GuildChannel || item instanceof Discord.GuildMember)) {
    const logChannel = item.guild.channels.find(c => c.name === 'sharon-log')
    if (logChannel && logChannel instanceof Discord.TextChannel) {
      await logChannel.send(message)
    } else {
      console.log(message)
    }
  }
}

client.on('channelUpdate', async (oldChannel, newChannel) => {
  const oldInfo = getChannelInfo(oldChannel)
  const newInfo = getChannelInfo(newChannel)
  if (oldInfo && oldInfo.type === ChannelType.Fleet) {
    store.dispatch(closedFleet(oldInfo))
    await log(oldChannel, `Closed fleet: ${oldInfo.name}`)
  }
  if (newInfo && newInfo.type === ChannelType.Fleet) {
    store.dispatch(newFleet(newInfo))
    await log(newChannel, `New fleet: ${newInfo.name}`)
  }
  if (oldInfo && oldInfo.type === ChannelType.Ship && (!newInfo || newInfo.type !== ChannelType.Ship)) {
    const fleet = getFleetInfo((oldChannel as Discord.GuildChannel).parent)
    store.dispatch(droppedShip(fleet, oldInfo))
    await log(oldChannel, `Dropped ship: ${oldInfo.name}`)
  }
  if (newInfo && newInfo.type === ChannelType.Ship && (!oldInfo || oldInfo.type !== ChannelType.Ship)) {
    const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
    store.dispatch(addedShip(fleet, newInfo))
    await log(newChannel, `Added ship: ${newInfo.name}`)
  }
  if (oldInfo && newInfo && oldInfo.type === ChannelType.Ship && newInfo.type === ChannelType.Ship) {
    const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
    store.dispatch(changedShip(fleet, oldInfo, newInfo))
    await log(newChannel, `Ship change ${oldInfo.name} ➡ ${newInfo.name}`)
  }
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (oldMember && oldMember.voiceChannel) {
    const oldPlayer = getPlayerInfo(oldMember)
    const oldInfo = getChannelInfo(oldMember.voiceChannel)
    const oldFleet = getFleetInfo(oldMember.voiceChannel.parent)
    if (oldInfo && oldInfo.type === ChannelType.Ship) {
      store.dispatch(leftShip(oldFleet, oldInfo, oldPlayer))
      await log(oldMember, `${oldPlayer.name} left ${oldFleet.name} ${oldInfo.name}`)
    }
  }
  if (newMember && newMember.voiceChannel) {
    const newPlayer = getPlayerInfo(newMember)
    const newInfo = getChannelInfo(newMember.voiceChannel)
    const newFleet = getFleetInfo(newMember.voiceChannel.parent)
    if (newInfo && newInfo.type === ChannelType.Ship) {
      store.dispatch(joinedShip(newFleet, newInfo, newPlayer))
      await log(newMember, `${newPlayer.name} joined ${newFleet.name} ${newInfo.name}`)
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
