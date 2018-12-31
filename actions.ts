import { FleetInfo, PlayerInfo, ShipInfo } from './model'

export enum ActionType {
  AddedShip = 'SHIP_ADDED',
  ChangedShip = 'SHIP_CHANGED',
  ClosedFleet = 'FLEET_CLOSED',
  DroppedShip = 'SHIP_DROPPED',
  JoinedShip = 'SHIP_JOINED',
  LeftShip = 'SHIP_LEFT',
  NewFleet = 'FLEET_NEW',
  Other = '__OTHER_ACTIONS__' // For default typing in case statements
}

export interface AddedShipAction {
  type: ActionType.AddedShip,
  fleet: FleetInfo
  ship: ShipInfo
}

export function addedShip (fleet: FleetInfo, ship: ShipInfo): AddedShipAction {
  return { type: ActionType.AddedShip, fleet, ship }
}

export interface ChangedShipAction {
  type: ActionType.ChangedShip
  fleet: FleetInfo
  oldShip: ShipInfo
  newShip: ShipInfo
}

export function changedShip (fleet: FleetInfo, oldShip: ShipInfo, newShip: ShipInfo): ChangedShipAction {
  return { type: ActionType.ChangedShip, fleet, oldShip, newShip }
}

export interface ClosedFleetAction {
  type: ActionType.ClosedFleet
  fleet: FleetInfo
}

export function closedFleet (fleet: FleetInfo): ClosedFleetAction {
  return { type: ActionType.ClosedFleet, fleet }
}

export interface DroppedShipAction {
  type: ActionType.DroppedShip
  fleet: FleetInfo
  ship: ShipInfo
}

export function droppedShip (fleet: FleetInfo, ship: ShipInfo): DroppedShipAction {
  return { type: ActionType.DroppedShip, fleet, ship }
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

export interface NewFleetAction {
  type: ActionType.NewFleet
  fleet: FleetInfo
}

export function newFleet (fleet: FleetInfo): NewFleetAction {
  return { type: ActionType.NewFleet, fleet }
}

export interface OtherAction {
  type: ActionType.Other
}

export type Action = AddedShipAction
  | ChangedShipAction
  | ClosedFleetAction
  | DroppedShipAction
  | JoinedShipAction
  | LeftShipAction
  | NewFleetAction
  | OtherAction
