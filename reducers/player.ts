import { Draft } from 'immer'
import { Action, ActionType } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import { getPlayer, getShip } from './model.ts'

export default function playerReducer(draft: Draft<Store>, action: Action) {
  if (
    action.type === ActionType.ActivePlayer ||
    action.type === ActionType.AlarmPlayerActivity ||
    action.type === ActionType.DeactivePlayer ||
    action.type === ActionType.JoinedShip ||
    action.type === ActionType.LeftShip
  ) {
    const ship = getShip(draft, action.fleet, action.ship)
    const player = getPlayer(draft, action.fleet, action.player)
    switch (action.type) {
      case ActionType.ActivePlayer:
        if (ship.visiting[action.player.id]) {
          ship.active[action.player.id] = ship.visiting[action.player.id]
          delete ship.visiting[action.player.id]
          if (!player.activity) {
            player.activity = []
          }
          player.activity.push({
            time: ship.active[action.player.id]!,
            shipId: action.ship.id,
            isActive: true,
          })
        }
        break
      case ActionType.AlarmPlayerActivity:
        if (!player.alarms) {
          player.alarms = {}
        }
        player.alarms.activityDuration = action.duration
        break
      case ActionType.DeactivePlayer:
        if (ship.leaving[action.player.id]) {
          ship.left[action.player.id] = ship.leaving[action.player.id]
          delete ship.leaving[action.player.id]
          if (!player.activity) {
            player.activity = []
          }
          player.activity.push({
            time: ship.left[action.player.id]!,
            shipId: action.ship.id,
            isActive: false,
          })
        }
        break
      case ActionType.JoinedShip:
        delete ship.left[action.player.id]
        if (ship.leaving[action.player.id]) {
          delete ship.leaving[action.player.id]
          ship.active[action.player.id] = new Date().toJSON()
        } else {
          ship.visiting[action.player.id] = new Date().toJSON()
        }
        player.info = action.player
        break
      case ActionType.LeftShip:
        delete ship.active[action.player.id]
        if (ship.visiting[action.player.id]) {
          delete ship.visiting[action.player.id]
          ship.left[action.player.id] = new Date().toJSON()
        } else {
          ship.leaving[action.player.id] = new Date().toJSON()
        }
        player.info = action.player
        break
    }
  }
}
