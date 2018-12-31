import * as Discord from 'discord.js'

export const BasicLoggingChannel = 'sharon-log'

export interface DiscordDependency {
  client: Discord.Client
}

export async function log (client: Discord.Client, guildId: string | null, message: string | null) {
  if (!message) {
    return
  }
  if (!guildId) {
    console.log(message)
    return
  }
  const guild = client.guilds.get(guildId)
  if (guild && guild.available) {
    const logChannel = guild.channels.find(c => c.name === 'sharon-log')
    if (logChannel && logChannel instanceof Discord.TextChannel) {
      await logChannel.send(message)
    } else {
      console.log(message)
    }
  } else {
    console.log(message)
  }
}
