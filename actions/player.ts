import { FleetInfo, ShipInfo, PlayerInfo } from '../model'
import { ActionType } from './index'

export interface JoinedShipAction {
  type: ActionType.JoinedShip
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function joinedShip (fleet: FleetInfo, ship: ShipInfo, player: PlayerInfo): JoinedShipAction {
  return { type: ActionType.JoinedShip, fleet, ship, player }
}

export interface LeftShipAction {
  type: ActionType.LeftShip
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function leftShip (fleet: FleetInfo, ship: ShipInfo, player: PlayerInfo): LeftShipAction {
  return { type: ActionType.LeftShip, fleet, ship, player }
}
