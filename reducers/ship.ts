import { Draft } from 'immer'
import { Action, ActionType } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import { getFleet, getShip } from './model.ts'

export default function shipReducer (draft: Draft<Store>, action: Action) {
  if (action.type === ActionType.AddedShip || action.type === ActionType.DroppedShip) {
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
      case ActionType.DroppedShip:
        delete fleet.ships[action.ship.id]
        break
    }
  }
  if (action.type === ActionType.AlarmShipBaby
    || action.type === ActionType.AlarmShipLow
    || action.type === ActionType.AlarmShipVeryLow
    || action.type === ActionType.ChangedShip
    || action.type === ActionType.UnalarmShipBaby
    || action.type === ActionType.UnalarmShipLow) {
    const ship = getShip(draft, action.fleet, action.ship)
    if (!ship.alarms) {
      ship.alarms = {}
    }
    switch (action.type) {
      case ActionType.AlarmShipBaby:
        ship.alarms.babies = action.babies
        break
      case ActionType.AlarmShipLow:
        ship.alarms.low = action.spots
        break
      case ActionType.AlarmShipVeryLow:
        ship.alarms.low = action.spots
        break
      case ActionType.ChangedShip:
        ship.info = action.ship
        break
      case ActionType.UnalarmShipBaby:
        delete ship.alarms.babies
        break
      case ActionType.UnalarmShipLow:
        delete ship.alarms.low
        break
    }
  }
}
