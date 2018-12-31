import produce from 'immer'
import { Action, ActionType } from './actions'
import { ShipInfo, FleetInfo } from './model'
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
        ships: {}
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
  switch (action.type) {
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
    case ActionType.DroppedShip: {
      const fleet = getFleet(action.fleet)
      delete fleet.ships[action.ship.id]
    } break
    case ActionType.JoinedShip: {
      const ship = getShip(action.fleet, action.ship)
      ship.visiting[action.player.id] = {
        info: action.player
      }
    } break
    case ActionType.LeftShip: {
      const ship = getShip(action.fleet, action.ship)
      if (ship.visiting[action.player.id]) {
        const player = ship.visiting[action.player.id]
        ship.leaving[action.player.id] = player
        delete ship.visiting[action.player.id]
      }
      if (ship.active[action.player.id]) {
        const player = ship.active[action.player.id]
        ship.leaving[action.player.id] = player
        delete ship.active[action.player.id]
      }
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
