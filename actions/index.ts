import { checkFleet, closedFleet, FleetAction, newFleet } from './fleet.ts'
import {
  createdGuildShip,
  GuildShipAction,
  removedGuildShip,
  updatedGuildShip,
} from './guild-ship.ts'
import { checkAll, checkGuild, GuildAction } from './guild.ts'
import {
  activePlayer,
  alarmPlayerActivity,
  deactivePlayer,
  joinedShip,
  leftShip,
  PlayerAction,
} from './player.ts'
import {
  addedShip,
  changedShip,
  checkShip,
  droppedShip,
  ShipAction,
} from './ship.ts'

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
  CreatedGuildShip = 'GUILD_SHIP_CREATED',
  DeactivePlayer = 'PLAYER_DEACTIVE',
  DroppedShip = 'SHIP_DROPPED',
  JoinedShip = 'SHIP_JOINED',
  LeftShip = 'SHIP_LEFT',
  NewFleet = 'FLEET_NEW',
  Other = '__OTHER_ACTIONS__', // For default typing in case statements
  RemovedGuildShip = 'GUILD_SHIP_REMOVED',
  UnalarmShipBaby = 'SHIP_BABY_REMOVE_ALARM',
  UnalarmShipLow = 'SHIP_LOW_REMOVE_ALARM',
  UpdatedGuildShip = 'GUILD_SHIP_UPDATED',
}

export interface OtherAction {
  type: ActionType.Other
}

export type Action =
  | FleetAction
  | GuildAction
  | GuildShipAction
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
  createdGuildShip,
  deactivePlayer,
  droppedShip,
  joinedShip,
  leftShip,
  newFleet,
  removedGuildShip,
  updatedGuildShip,
}
