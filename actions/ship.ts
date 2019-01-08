import { FleetInfo, ShipInfo } from '../models'
import { ActionType } from './index'

export interface AddedShipAction {
  type: ActionType.AddedShip,
  fleet: FleetInfo
  ship: ShipInfo
}

export function addedShip (fleet: FleetInfo, ship: ShipInfo): AddedShipAction {
  return { type: ActionType.AddedShip, fleet, ship }
}

export interface AlarmShipBabyAction {
  type: ActionType.AlarmShipBaby
  fleet: FleetInfo
  ship: ShipInfo
  babies: number
}

export function alarmShipBaby (fleet: FleetInfo, ship: ShipInfo, babies: number): AlarmShipBabyAction {
  return { type: ActionType.AlarmShipBaby, fleet, ship, babies }
}

export interface AlarmShipLowAction {
  type: ActionType.AlarmShipLow
  fleet: FleetInfo
  ship: ShipInfo
  spots: number
}

export function alarmShipLow (fleet: FleetInfo, ship: ShipInfo, spots: number): AlarmShipLowAction {
  return { type: ActionType.AlarmShipLow, fleet, ship, spots }
}

export interface AlarmShipVeryLowAction {
  type: ActionType.AlarmShipVeryLow
  fleet: FleetInfo
  ship: ShipInfo
  spots: number
}

export function alarmShipVeryLow (fleet: FleetInfo, ship: ShipInfo, spots: number): AlarmShipVeryLowAction {
  return { type: ActionType.AlarmShipVeryLow, fleet, ship, spots }
}

export interface ChangedShipAction {
  type: ActionType.ChangedShip
  fleet: FleetInfo
  oldShip: ShipInfo
  ship: ShipInfo
}

export function changedShip (fleet: FleetInfo, oldShip: ShipInfo, ship: ShipInfo): ChangedShipAction {
  return { type: ActionType.ChangedShip, fleet, oldShip, ship }
}

export interface CheckShipAction {
  type: ActionType.CheckShip
  fleet: FleetInfo
  ship: ShipInfo
}

export function checkShip (fleet: FleetInfo, ship: ShipInfo): CheckShipAction {
  return { type: ActionType.CheckShip, fleet, ship }
}

export interface DroppedShipAction {
  type: ActionType.DroppedShip
  fleet: FleetInfo
  ship: ShipInfo
}

export function droppedShip (fleet: FleetInfo, ship: ShipInfo): DroppedShipAction {
  return { type: ActionType.DroppedShip, fleet, ship }
}

export interface UnalarmShipBabyAction {
  type: ActionType.UnalarmShipBaby
  fleet: FleetInfo
  ship: ShipInfo
}

export function unalarmShipBaby (fleet: FleetInfo, ship: ShipInfo): UnalarmShipBabyAction {
  return { type: ActionType.UnalarmShipBaby, fleet, ship }
}

export interface UnalarmShipLowAction {
  type: ActionType.UnalarmShipLow
  fleet: FleetInfo
  ship: ShipInfo
}

export function unalarmShipLow (fleet: FleetInfo, ship: ShipInfo): UnalarmShipLowAction {
  return { type: ActionType.UnalarmShipLow, fleet, ship }
}

export type ShipAction = AddedShipAction
  | AlarmShipBabyAction
  | AlarmShipLowAction
  | AlarmShipVeryLowAction
  | ChangedShipAction
  | CheckShipAction
  | DroppedShipAction
  | UnalarmShipBabyAction
  | UnalarmShipLowAction
