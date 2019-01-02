import { FleetInfo, ShipInfo } from '../model'
import { ActionType } from './index'

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
