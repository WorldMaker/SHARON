import { CategoryChannel, Channel, GuildChannel, VoiceChannel } from 'discord.js'
import { ChannelType } from './channel-type'
import { FleetInfo, ShipInfo, nlp } from './index'
import { getFleetInfo } from './fleet'
import { getShipInfo } from './ship'

export function getChannelInfo (channel: Channel): FleetInfo | ShipInfo | null {
  if (channel instanceof GuildChannel) {
    const doc = (nlp as any)(channel.name)
    if (channel instanceof CategoryChannel) {
      if (doc.has('#Fleet')) {
        return getFleetInfo(channel, doc)
      }
    } else if (channel instanceof VoiceChannel) {
      if (doc.has('#Ship')) {
        return getShipInfo(channel, doc)
      }
    }
  }
  return null
}

export function isFleet (info: ShipInfo | FleetInfo | null): info is FleetInfo {
  return !!info && info.type === ChannelType.Fleet
}

export function isShip (info: ShipInfo | FleetInfo | null): info is ShipInfo {
  return !!info && info.type === ChannelType.Ship
}
