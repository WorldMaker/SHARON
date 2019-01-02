import { CheckFleetAction, ClosedFleetAction, NewFleetAction, checkFleet, closedFleet, newFleet } from './fleet'
import { CheckAllAction, CheckGuildAction, checkAll, checkGuild } from './guild'
import { JoinedShipAction, LeftShipAction, leftShip, joinedShip } from './player'
import { AddedShipAction, addedShip, ChangedShipAction, changedShip, CheckShipAction, checkShip, DroppedShipAction, droppedShip } from './ship'

export enum ActionType {
  AddedShip = 'SHIP_ADDED',
  ChangedShip = 'SHIP_CHANGED',
  CheckAll = 'CHECK',
  CheckGuild = 'GUILD_CHECK',
  CheckFleet = 'FLEET_CHECK',
  CheckShip = 'SHIP_CHECK',
  ClosedFleet = 'FLEET_CLOSED',
  DroppedShip = 'SHIP_DROPPED',
  JoinedShip = 'SHIP_JOINED',
  LeftShip = 'SHIP_LEFT',
  NewFleet = 'FLEET_NEW',
  Other = '__OTHER_ACTIONS__' // For default typing in case statements
}

export interface OtherAction {
  type: ActionType.Other
}

export type Action = AddedShipAction
  | ChangedShipAction
  | CheckAllAction
  | CheckFleetAction
  | CheckGuildAction
  | CheckShipAction
  | ClosedFleetAction
  | DroppedShipAction
  | JoinedShipAction
  | LeftShipAction
  | NewFleetAction
  | OtherAction

export {
  addedShip,
  changedShip,
  checkAll,
  checkFleet,
  checkGuild,
  checkShip,
  closedFleet,
  droppedShip,
  joinedShip,
  leftShip,
  newFleet
}
