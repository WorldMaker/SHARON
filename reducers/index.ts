import { produce } from 'immer'
import { Action } from '../actions/index.ts'
import { initialState } from '../models/store/index.ts'
import fleetReducer from './fleet.ts'
import playerReducer from './player.ts'
import shipReducer from './ship.ts'

const reducer = produce((draft, action: Action) => {
  fleetReducer(draft, action)
  shipReducer(draft, action)
  playerReducer(draft, action)
}, initialState)

export default reducer
