import * as Discord from 'discord.js'

export const BasicLoggingChannel = 'sharon-log'
const FleetStatusChannel = 'fleet-status'
export const ShoutMode = true

export interface DiscordDependency {
  client: Discord.Client<true>
}

export async function log(
  client: Discord.Client<true>,
  guildId: string | null,
  message: string | null,
) {
  if (!message) {
    return
  }
  if (ShoutMode) {
    message = message.toLocaleUpperCase()
  }
  if (!guildId) {
    console.log(message)
    return
  }
  const guild = await client.guilds.fetch(guildId)
  if (guild && guild.available) {
    const logChannel = (await guild.channels.fetch()).find((c) => c?.name === 'sharon-log')
    if (logChannel && logChannel instanceof Discord.TextChannel) {
      await logChannel.send(message)
    } else {
      console.log(message)
    }
  } else {
    console.log(message)
  }
}

export async function sendFleetStatus(
  client: Discord.Client<true>,
  guildId: string,
  fleetId: string,
  message: string | null,
) {
  if (!message) {
    return
  }
  const guild = client.guilds.valueOf().get(guildId)
  if (guild && guild.available) {
    const fleet = guild.channels.valueOf().get(fleetId)
    if (fleet && fleet instanceof Discord.CategoryChannel) {
      const statusChannel = fleet.children.valueOf().find((c) =>
        c.name === FleetStatusChannel
      )
      if (statusChannel && statusChannel instanceof Discord.TextChannel) {
        await statusChannel.send(
          ShoutMode ? message.toLocaleUpperCase() : message,
        )
      }
    }
  }
}
