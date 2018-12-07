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
  if (newChannel instanceof Discord.CategoryChannel) {
    const doc = (nlp as any)(newChannel.name)
    const isFleet = doc.has('#Fleet')
    if (isFleet) {
      if (oldChannel instanceof Discord.CategoryChannel) {
        const doc = (nlp as any)(oldChannel.name)
        const isFleet = doc.has('#Fleet')
        if (isFleet) {
          await log(oldChannel, `Closed fleet: ${oldChannel.name}`)
        }
      }
      await log(newChannel, `New fleet: ${newChannel.name}`)
    }
  } else if ((oldChannel instanceof Discord.VoiceChannel) && (newChannel instanceof Discord.VoiceChannel)) {
    const oldDoc = (nlp as any)(oldChannel.name)
    const newDoc = (nlp as any)(newChannel.name)
    const oldShip = oldDoc.match('#Ship')
    const newShip = newDoc.match('#Ship')
    if (oldShip.length || newShip.length) {
      await log(newChannel, `Ship change ${oldChannel.name} ➡ ${newChannel.name}`)
    }
  }
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (!oldMember || !newMember || oldMember.voiceChannelID !== newMember.voiceChannelID) {
    if (oldMember && oldMember.voiceChannel) {
      const oldDoc = (nlp as any)(oldMember.voiceChannel.name)
      if (oldDoc.has('#Ship')) {
        await log(oldMember, `${oldMember.displayName} left ${oldMember.voiceChannel.parent.name} ${oldMember.voiceChannel.name}`)
      }
    }
    if (newMember && newMember.voiceChannel) {
      const newDoc = (nlp as any)(newMember.voiceChannel.name)
      if (newDoc.has('#Ship')) {
        await log(newMember, `${newMember.displayName} joined ${newMember.voiceChannel.parent.name} ${newMember.voiceChannel.name}`)
      }
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
