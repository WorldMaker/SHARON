import { Draft } from 'immer'
import { Action, ActionType } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import { getGuildShips } from './model.ts'

export function guildShipsReducer(draft: Draft<Store>, action: Action) {
  switch (action.type) {
    case ActionType.CreatedGuildShip: {
      const guildShips = getGuildShips(draft, action.ship.guildId)
      guildShips[action.ship.rareId] = { info: action.ship }
      break
    }
    case ActionType.RemovedGuildShip: {
      const guildShips = getGuildShips(draft, action.guildId)
      delete guildShips[action.rareId]
      break
    }
    case ActionType.UpdatedGuildShip: {
      const guildShips = getGuildShips(draft, action.ship.guildId)
      if (guildShips[action.ship.rareId]) {
        guildShips[action.ship.rareId].info = action.ship
      }
      break
    }
  }
}
