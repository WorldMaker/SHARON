import { ofType, StateObservable } from 'redux-observable'
import { from, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { alarmPlayerActivity } from '../../actions/player.ts'
import { Action, ActionType } from '../../actions/index.ts'
import { getPlayerActivityDuration } from '../../models/store/player.ts'
import { Store } from '../../models/store/index.ts'

export const PlayerActivityAlarmInterval = 6 /* h */ * 60 /* min */ *
  60 /* s */ * 1000 /* ms */

export default function playerActivityAlarmEpic(
  action: Observable<Action>,
  state: StateObservable<Store>,
) {
  return action.pipe(
    ofType(ActionType.CheckShip),
    concatMap((action) => {
      const ship =
        state.value.guilds[action.fleet.guildId].fleets[action.fleet.id]
          .ships[action.ship.id]
      const playerActivity = [...Object.keys(ship.active)]
        .map((key) =>
          state.value.guilds[action.fleet.guildId].fleets[action.fleet.id]
            .players[key]
        )
        .filter((player) => !!player)
        .map((player) => ({
          player,
          duration: getPlayerActivityDuration(player.activity),
        }))
        .filter(({ duration }) => duration >= PlayerActivityAlarmInterval)
        .map(({ player, duration }) =>
          alarmPlayerActivity(action.fleet, action.ship, player.info, duration)
        )
      return from(playerActivity)
    }),
  )
}
