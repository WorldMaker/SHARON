import { FleetInfo, PlayerInfo, ShipInfo } from '../models/index.ts'
import { ActionType } from './index.ts'

export interface ActivePlayerAction {
  type: ActionType.ActivePlayer
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function activePlayer(
  fleet: FleetInfo,
  ship: ShipInfo,
  player: PlayerInfo,
): ActivePlayerAction {
  return { type: ActionType.ActivePlayer, fleet, ship, player }
}

export interface AlarmPlayerActivityAction {
  type: ActionType.AlarmPlayerActivity
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
  duration: number
}

export function alarmPlayerActivity(
  fleet: FleetInfo,
  ship: ShipInfo,
  player: PlayerInfo,
  duration: number,
): AlarmPlayerActivityAction {
  return { type: ActionType.AlarmPlayerActivity, fleet, ship, player, duration }
}

export interface DeactivePlayerAction {
  type: ActionType.DeactivePlayer
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function deactivePlayer(
  fleet: FleetInfo,
  ship: ShipInfo,
  player: PlayerInfo,
): DeactivePlayerAction {
  return { type: ActionType.DeactivePlayer, fleet, ship, player }
}

export interface JoinedShipAction {
  type: ActionType.JoinedShip
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function joinedShip(
  fleet: FleetInfo,
  ship: ShipInfo,
  player: PlayerInfo,
): JoinedShipAction {
  return { type: ActionType.JoinedShip, fleet, ship, player }
}

export interface LeftShipAction {
  type: ActionType.LeftShip
  fleet: FleetInfo
  ship: ShipInfo
  player: PlayerInfo
}

export function leftShip(
  fleet: FleetInfo,
  ship: ShipInfo,
  player: PlayerInfo,
): LeftShipAction {
  return { type: ActionType.LeftShip, fleet, ship, player }
}

export type PlayerAction =
  | ActivePlayerAction
  | AlarmPlayerActivityAction
  | DeactivePlayerAction
  | JoinedShipAction
  | LeftShipAction
