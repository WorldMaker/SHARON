import { GuildShipInfo } from '../models/guild-ship.ts'
import { ActionType } from './index.ts'

export interface CreatedGuildShipAction {
  type: ActionType.CreatedGuildShip
  ship: GuildShipInfo
}

export function createdGuildShip(ship: GuildShipInfo): CreatedGuildShipAction {
  return {
    type: ActionType.CreatedGuildShip,
    ship,
  }
}

export interface RemovedGuildShipAction {
  type: ActionType.RemovedGuildShip
  guildId: string
  rareId: string
}

export function removedGuildShip(
  guildId: string,
  rareId: string,
): RemovedGuildShipAction {
  return {
    type: ActionType.RemovedGuildShip,
    guildId,
    rareId,
  }
}

export interface UpdatedGuildShipAction {
  type: ActionType.UpdatedGuildShip
  ship: GuildShipInfo
}

export function updatedGuildShip(ship: GuildShipInfo): UpdatedGuildShipAction {
  return {
    type: ActionType.UpdatedGuildShip,
    ship,
  }
}

export type GuildShipAction =
  | CreatedGuildShipAction
  | RemovedGuildShipAction
  | UpdatedGuildShipAction
