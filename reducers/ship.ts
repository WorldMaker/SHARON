import { Draft } from 'immer'
import { Action, ActionType } from '../actions'
import { Store } from '../models/store'
import { getFleet, getShip } from './model'

export default function shipReducer (draft: Draft<Store>, action: Action) {
  if (action.type === ActionType.AddedShip || action.type === ActionType.ChangedShip || action.type === ActionType.DroppedShip) {
    const fleet = getFleet(draft, action.fleet)
    switch (action.type) {
      case ActionType.AddedShip:
        fleet.ships[action.ship.id] = {
          active: {},
          info: action.ship,
          leaving: {},
          left: {},
          visiting: {}
        }
        break
      case ActionType.ChangedShip:
        const ship = getShip(draft, action.fleet, action.ship)
        ship.info = action.ship
        break
      case ActionType.DroppedShip:
        delete fleet.ships[action.ship.id]
        break
    }
  }
}
