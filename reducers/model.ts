import { Draft } from 'immer'
import { Store } from '../models/store'
import { FleetInfo, ShipInfo, PlayerInfo } from '../models'
import { FleetStore } from '../models/store/fleet'

export function getFleet (draft: Draft<Store>, info: FleetInfo) {
  let guild = draft.guilds[info.guildId]
  if (!guild) {
    guild = draft.guilds[info.guildId] = {
      fleets: {}
    }
  }
  let fleet = guild.fleets[info.id]
  if (!fleet) {
    fleet = guild.fleets[info.id] = {
      active: true,
      info,
      ships: {},
      players: {}
    }
  }
  return fleet
}

export function getShip (draft: Draft<Store>, fleetInfo: FleetInfo, info: ShipInfo) {
  const fleet = getFleet(draft, fleetInfo)
  let ship = fleet.ships[info.id]
  if (!ship) {
    ship = fleet.ships[info.id] = {
      active: {},
      info,
      leaving: {},
      left: {},
      visiting: {}
    }
  }
  return ship
}

export function getPlayer (draft: Draft<Store>, fleetInfo: FleetInfo, info: PlayerInfo) {
  const fleet = getFleet(draft, fleetInfo)
  let player = fleet.players[info.id]
  if (!player) {
    player = fleet.players[info.id] = {
      info,
      activity: []
    }
  }
  return player
}
