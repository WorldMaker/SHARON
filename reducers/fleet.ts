import { Draft } from 'immer'
import { Action, ActionType } from '../actions'
import { Store } from '../models/store'
import { getFleet } from './model'

export default function fleetReducer (draft: Draft<Store>, action: Action) {
  if (action.type === ActionType.ClosedFleet || action.type === ActionType.NewFleet) {
    const fleet = getFleet(draft, action.fleet)
    switch (action.type) {
      case ActionType.ClosedFleet:
        fleet.active = false
        break
      case ActionType.NewFleet:
        fleet.active = true
        fleet.info = action.fleet
        fleet.ships = {}
        break
    }
  }
}
