import { VoiceChannel } from 'discord.js'
import { ChannelType, nlp } from './index'

export interface ShipInfo {
  type: ChannelType.Ship
  fleetId: string
  guildId: string
  id: string
  name: string
  shipType: string
  number: number | null
}

export function getShipInfo (ship: VoiceChannel, doc: any = null): ShipInfo {
  if (!doc) {
    doc = (nlp as any)(ship.name)
  }
  const values = doc.values()
  return {
    type: ChannelType.Ship,
    fleetId: ship.parent.id,
    guildId: ship.guild.id,
    id: ship.id,
    name: ship.name,
    shipType: doc.match('#Ship').out('normal'),
    number: values && values.length ? values.numbers[0] : null
  }
}
