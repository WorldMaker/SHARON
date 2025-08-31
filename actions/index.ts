import { FleetAction, checkFleet, closedFleet, newFleet } from './fleet.ts'
import { GuildAction, checkAll, checkGuild } from './guild.ts'
import { PlayerAction, activePlayer, deactivePlayer, alarmPlayerActivity, leftShip, joinedShip } from './player.ts'
import { ShipAction, addedShip, changedShip, checkShip, droppedShip } from './ship.ts'

export enum ActionType {
  ActivePlayer = 'PLAYER_ACTIVE',
  AddedShip = 'SHIP_ADDED',
  AlarmPlayerActivity = 'PLAYER_ACTIVE_ALARM',
  AlarmShipBaby = 'SHIP_BABY_ALARM',
  AlarmShipLow = 'SHIP_LOW_ALARM',
  AlarmShipVeryLow = 'SHIP_VERY_LOW_ALARM',
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
  Other = '__OTHER_ACTIONS__', // For default typing in case statements
  UnalarmShipBaby = 'SHIP_BABY_REMOVE_ALARM',
  UnalarmShipLow = 'SHIP_LOW_REMOVE_ALARM'
}

export interface OtherAction {
  type: ActionType.Other
}

export type Action = FleetAction
  | GuildAction
  | PlayerAction
  | ShipAction
  | OtherAction

export {
  activePlayer,
  addedShip,
  alarmPlayerActivity,
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
