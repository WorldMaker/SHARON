import { FleetInfo } from '../models'
import { ActionType } from './index'

export interface CheckFleetAction {
  type: ActionType.CheckFleet
  fleet: FleetInfo
}

export function checkFleet (fleet: FleetInfo): CheckFleetAction {
  return { type: ActionType.CheckFleet, fleet }
}

export interface ClosedFleetAction {
  type: ActionType.ClosedFleet
  fleet: FleetInfo
}

export function closedFleet (fleet: FleetInfo): ClosedFleetAction {
  return { type: ActionType.ClosedFleet, fleet }
}

export interface NewFleetAction {
  type: ActionType.NewFleet
  fleet: FleetInfo
}

export function newFleet (fleet: FleetInfo): NewFleetAction {
  return { type: ActionType.NewFleet, fleet }
}
