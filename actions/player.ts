import { FleetInfo, ShipInfo, PlayerInfo } from '../models'
import { ActionType } from './index'

export interface ActivePlayerAction {
  type: ActionType.ActivePlayer
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function activePlayer (fleet: FleetInfo, ship: ShipInfo, player: PlayerInfo): ActivePlayerAction {
  return { type: ActionType.ActivePlayer, fleet, ship, player }
}

export interface DeactivePlayerAction {
  type: ActionType.DeactivePlayer
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function deactivePlayer (fleet: FleetInfo, ship: ShipInfo, player: PlayerInfo): DeactivePlayerAction {
  return { type: ActionType.DeactivePlayer, fleet, ship, player }
}

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
