import { CategoryChannel } from 'discord.js'
import { ChannelType, nlp, View } from './index.ts'

export interface FleetInfo {
  type: ChannelType.Fleet
  guildId: string
  id: string
  name: string
  number: number | null
}

export function getFleetInfo(
  fleet: CategoryChannel,
  doc: View | null = null,
): FleetInfo {
  if (!doc) {
    doc = nlp(fleet.name)
  }
  const values = doc.numbers().get(0)
  return {
    type: ChannelType.Fleet,
    guildId: fleet.guild.id,
    id: fleet.id,
    name: fleet.name,
    number: values && typeof values === 'number' ? values : null,
  }
}
