import nlp from 'compromise'
import * as Discord from 'discord.js'
import * as nlpPlugin from './compromise-plugin.json'

nlp.plugin(nlpPlugin)

export enum ChannelType {
  Fleet = 'fleet',
  Ship = 'ship'
}

export interface FleetInfo {
  type: ChannelType.Fleet
  guildId: string
  id: string
  name: string
  number: number | null
}

export interface ShipInfo {
  type: ChannelType.Ship
  fleetId: string
  guildId: string
  id: string
  name: string
  shipType: string
  number: number | null
}

export interface PlayerInfo {
  fleetId: string
  guildId: string
  shipId: string | null
  id: string
  hoistRoleName: string | null
  name: string
  username: string
}

export function getFleetInfo (fleet: Discord.CategoryChannel, doc: any = null): FleetInfo {
  if (!doc) {
    doc = (nlp as any)(fleet.name)
  }
  const values = doc.values()
  return {
    type: ChannelType.Fleet,
    guildId: fleet.guild.id,
    id: fleet.id,
    name: fleet.name,
    number: values && values.length ? values.numbers[0] : null
  }
}

export function getShipInfo (ship: Discord.VoiceChannel, doc: any = null): ShipInfo {
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

export function getPlayerInfo (fleet: FleetInfo, ship: ShipInfo | null, player: Discord.GuildMember): PlayerInfo {
  return {
    fleetId: fleet.id,
    guildId: fleet.guildId,
    shipId: ship && ship.id,
    id: player.id,
    hoistRoleName: player.hoistRole ? player.hoistRole.name : null,
    name: player.displayName,
    username: player.user.username
  }
}

export function getChannelInfo (channel: Discord.Channel): FleetInfo | ShipInfo | null {
  if (channel instanceof Discord.GuildChannel) {
    const doc = (nlp as any)(channel.name)
    if (channel instanceof Discord.CategoryChannel) {
      if (doc.has('#Fleet')) {
        return getFleetInfo(channel, doc)
      }
    } else if (channel instanceof Discord.VoiceChannel) {
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
