import { ActionType } from './index'

export interface CheckAllAction {
  type: ActionType.CheckAll
}

export function checkAll (): CheckAllAction {
  return { type: ActionType.CheckAll }
}

export interface CheckGuildAction {
  type: ActionType.CheckGuild
  guildId: string
}

export function checkGuild (guildId: string): CheckGuildAction {
  return { type: ActionType.CheckGuild, guildId }
}
