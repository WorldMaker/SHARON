import { produce } from 'immer'
import { Action } from '../actions/index.ts'
import { initialState } from '../models/store/index.ts'
import fleetReducer from './fleet.ts'
import playerReducer from './player.ts'
import shipReducer from './ship.ts'
import { guildShipsReducer } from './guild-ships.ts'

const reducer = produce((draft, action: Action) => {
  fleetReducer(draft, action)
  guildShipsReducer(draft, action)
  shipReducer(draft, action)
  playerReducer(draft, action)
}, initialState)

export default reducer
