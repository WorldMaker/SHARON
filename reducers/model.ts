import { Draft } from 'immer'
import { Store } from '../models/store/index.ts'
import { FleetInfo, PlayerInfo, ShipInfo } from '../models/index.ts'

export function getGuild(draft: Draft<Store>, guildId: string) {
  let guild = draft.guilds[guildId]
  if (!guild) {
    guild = draft.guilds[guildId] = {
      fleets: {},
    }
  }
  return guild
}

export function getFleet(draft: Draft<Store>, info: FleetInfo) {
  const guild = getGuild(draft, info.guildId)
  let fleet = guild.fleets[info.id]
  if (!fleet) {
    fleet = guild.fleets[info.id] = {
      active: true,
      info,
      ships: {},
      players: {},
    }
  }
  return fleet
}

export function getGuildShips(draft: Draft<Store>, guildId: string) {
  const guild = getGuild(draft, guildId)
  if (!guild.guildShips) {
    guild.guildShips = {}
  }
  return guild.guildShips
}

export function getShip(
  draft: Draft<Store>,
  fleetInfo: FleetInfo,
  info: ShipInfo,
) {
  const fleet = getFleet(draft, fleetInfo)
  let ship = fleet.ships[info.id]
  if (!ship) {
    ship = fleet.ships[info.id] = {
      active: {},
      info,
      leaving: {},
      left: {},
      visiting: {},
    }
  }
  return ship
}

export function getPlayer(
  draft: Draft<Store>,
  fleetInfo: FleetInfo,
  info: PlayerInfo,
) {
  const fleet = getFleet(draft, fleetInfo)
  let player = fleet.players[info.id]
  if (!player) {
    player = fleet.players[info.id] = {
      info,
      activity: [],
    }
  }
  return player
}
