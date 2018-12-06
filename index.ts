import nlp from 'compromise'
import * as Discord from 'discord.js'
import * as nlpPlugin from './compromise-plugin.json'
import { BotToken } from './secrets.json'

nlp.plugin(nlpPlugin)

const client = new Discord.Client()

client.on('error', err => {
  console.error(err)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('channelUpdate', (oldChannel, newChannel) => {
  if (newChannel instanceof Discord.CategoryChannel) {
    const doc = (nlp as any)(newChannel.name)
    const isFleet = doc.has('#Fleet')
    if (isFleet) {
      console.log('Fleet updated', newChannel.name)
    }
  } else if ((oldChannel instanceof Discord.GuildChannel || oldChannel instanceof Discord.VoiceChannel)
      && (newChannel instanceof Discord.GuildChannel || newChannel instanceof Discord.VoiceChannel)) {
    const oldDoc = (nlp as any)(oldChannel.name)
    const newDoc = (nlp as any)(newChannel.name)
    const oldShip = oldDoc.match('#Ship')
    const newShip = newDoc.match('#Ship')
    if (oldShip.length || newShip.length) {
      console.log(`Ship change ${oldChannel.name} -> ${newChannel.name}`)
    }
  }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (!oldMember || !newMember || oldMember.voiceChannelID !== newMember.voiceChannelID) {
    if (oldMember && oldMember.voiceChannel) {
      const oldDoc = (nlp as any)(oldMember.voiceChannel.name)
      if (oldDoc.has('#Ship')) {
        console.log(`${oldMember.displayName} left ${oldMember.voiceChannel.name}`)
      }
    }
    if (newMember && newMember.voiceChannel) {
      const newDoc = (nlp as any)(newMember.voiceChannel.name)
      if (newDoc.has('#Ship')) {
        console.log(`${newMember.displayName} joined ${newMember.voiceChannel.name}`)
      }
    }
  }
})

client.login(BotToken)
  .catch(err => console.error('Error logging in', err))
