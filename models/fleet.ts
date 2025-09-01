import { CategoryChannel } from 'discord.js'
import { ChannelType, nlp } from './index.ts'

export interface FleetInfo {
  type: ChannelType.Fleet
  guildId: string
  id: string
  name: string
  number: number | null
}

export function getFleetInfo(
  fleet: CategoryChannel,
  doc: any = null,
): FleetInfo {
  if (!doc) {
    doc = (nlp as any)(fleet.name)
  }
  const values = doc.values()
  return {
    type: ChannelType.Fleet,
    guildId: fleet.guild.id,
    id: fleet.id,
    name: fleet.name,
    number: values && values.length ? values.numbers[0] : null,
  }
}
