import { CheckFleetAction, ClosedFleetAction, NewFleetAction, checkFleet, closedFleet, newFleet } from './fleet'
import { CheckAllAction, CheckGuildAction, checkAll, checkGuild } from './guild'
import { ActivePlayerAction, DeactivePlayerAction, activePlayer, deactivePlayer, JoinedShipAction, LeftShipAction, leftShip, joinedShip } from './player'
import { AddedShipAction, addedShip, ChangedShipAction, changedShip, CheckShipAction, checkShip, DroppedShipAction, droppedShip } from './ship'

export enum ActionType {
  ActivePlayer = 'PLAYER_ACTIVE',
  AddedShip = 'SHIP_ADDED',
  ChangedShip = 'SHIP_CHANGED',
  CheckAll = 'CHECK',
  CheckGuild = 'GUILD_CHECK',
  CheckFleet = 'FLEET_CHECK',
  CheckShip = 'SHIP_CHECK',
  ClosedFleet = 'FLEET_CLOSED',
  DeactivePlayer = 'PLAYER_DEACTIVE',
  DroppedShip = 'SHIP_DROPPED',
  JoinedShip = 'SHIP_JOINED',
  LeftShip = 'SHIP_LEFT',
  NewFleet = 'FLEET_NEW',
  Other = '__OTHER_ACTIONS__' // For default typing in case statements
}

export interface OtherAction {
  type: ActionType.Other
}

export type Action = ActivePlayerAction
  | AddedShipAction
  | ChangedShipAction
  | CheckAllAction
  | CheckFleetAction
  | CheckGuildAction
  | CheckShipAction
  | ClosedFleetAction
  | DeactivePlayerAction
  | DroppedShipAction
  | JoinedShipAction
  | LeftShipAction
  | NewFleetAction
  | OtherAction

export {
  activePlayer,
  addedShip,
  changedShip,
  checkAll,
  checkFleet,
  checkGuild,
  checkShip,
  closedFleet,
  deactivePlayer,
  droppedShip,
  joinedShip,
  leftShip,
  newFleet
}
