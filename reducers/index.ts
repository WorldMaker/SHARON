import produce from 'immer'
import { Action, ActionType } from '../actions'
import { Store } from '../models/store'
import fleetReducer from './fleet'
import playerReducer from './player'
import shipReducer from './ship'

const reducer = produce((draft, action: Action) => {
  fleetReducer(draft, action)
  shipReducer(draft, action)
  playerReducer(draft, action)
}, {
  guilds: {}
} as Store)

export default reducer
