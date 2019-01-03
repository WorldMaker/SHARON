import produce from 'immer'
import { Action, ActionType } from './actions'
import { ShipInfo, FleetInfo, PlayerInfo } from './model'
import { Store } from './store'

const reducer = produce((draft, action: Action) => {
  const getFleet = (info: FleetInfo) => {
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
  const getShip = (fleetInfo: FleetInfo, info: ShipInfo) => {
    const fleet = getFleet(fleetInfo)
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
  const getPlayer = (fleetInfo: FleetInfo, info: PlayerInfo) => {
    const fleet = getFleet(fleetInfo)
    let player = fleet.players[info.id]
    if (!player) {
      player = fleet.players[info.id] = {
        info,
        activity: []
      }
    }
    return player
  }
  switch (action.type) {
    case ActionType.ActivePlayer: {
      const ship = getShip(action.fleet, action.ship)
      const player = getPlayer(action.fleet, action.player)
      if (ship.visiting[action.player.id]) {
        ship.active[action.player.id] = ship.visiting[action.player.id]
        delete ship.visiting[action.player.id]
        if (!player.activity) {
          player.activity = []
        }
        player.activity.push({
          time: ship.active[action.player.id]!,
          shipId: action.ship.id,
          isActive: true
        })
      }
    } break
    case ActionType.AddedShip: {
      const fleet = getFleet(action.fleet)
      fleet.ships[action.ship.id] = {
        active: {},
        info: action.ship,
        leaving: {},
        left: {},
        visiting: {}
      }
    } break
    case ActionType.ChangedShip: {
      const ship = getShip(action.fleet, action.newShip)
      ship.info = action.newShip
    } break
    case ActionType.ClosedFleet: {
      const fleet = getFleet(action.fleet)
      fleet.active = false
    } break
    case ActionType.DeactivePlayer: {
      const ship = getShip(action.fleet, action.ship)
      const player = getPlayer(action.fleet, action.player)
      if (ship.leaving[action.player.id]) {
        ship.left[action.player.id] = ship.leaving[action.player.id]
        delete ship.leaving[action.player.id]
        if (!player.activity) {
          player.activity = []
        }
        player.activity.push({
          time: ship.left[action.player.id]!,
          shipId: action.ship.id,
          isActive: false
        })
      }
    } break
    case ActionType.DroppedShip: {
      const fleet = getFleet(action.fleet)
      delete fleet.ships[action.ship.id]
    } break
    case ActionType.JoinedShip: {
      const ship = getShip(action.fleet, action.ship)
      const player = getPlayer(action.fleet, action.player)
      delete ship.left[action.player.id]
      if (ship.leaving[action.player.id]) {
        delete ship.leaving[action.player.id]
        ship.active[action.player.id] = new Date().toJSON()
      } else {
        ship.visiting[action.player.id] = new Date().toJSON()
      }
      player.info = action.player
    } break
    case ActionType.LeftShip: {
      const ship = getShip(action.fleet, action.ship)
      const player = getPlayer(action.fleet, action.player)
      delete ship.active[action.player.id]
      if (ship.visiting[action.player.id]) {
        delete ship.visiting[action.player.id]
        ship.left[action.player.id] = new Date().toJSON()
      } else {
        ship.leaving[action.player.id] = new Date().toJSON()
      }
      player.info = action.player
    } break
    case ActionType.NewFleet: {
      const fleet = getFleet(action.fleet)
      fleet.active = true
      fleet.info = action.fleet
      fleet.ships = {}
    } break
  }
}, {
  guilds: {}
} as Store)

export default reducer
