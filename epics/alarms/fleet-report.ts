import { ofType, StateObservable } from 'redux-observable'
import { from, Observable } from 'rxjs'
import { concatMap, groupBy, ignoreElements, mergeMap } from 'rxjs/operators'
import { Action, ActionType } from '../../actions/index.ts'
import { Store } from '../../models/store/index.ts'
import actionReport from '../../reports/actions.ts'
import { DiscordDependency, sendFleetStatus } from '../model.ts'

export default function reportFleetAlarmsEpic(
  action: Observable<Action>,
  _state: StateObservable<Store>,
  { client }: DiscordDependency,
) {
  return action.pipe(
    ofType(
      ActionType.AlarmPlayerActivity,
      ActionType.AlarmShipBaby,
      ActionType.AlarmShipLow,
      ActionType.AlarmShipVeryLow,
    ),
    groupBy((action) => action.fleet.id),
    mergeMap((g) =>
      g.pipe(
        concatMap((action) =>
          from(sendFleetStatus(
            client,
            action.fleet.guildId,
            action.fleet.id,
            actionReport(action)[1],
          ))
        ),
      )
    ),
    ignoreElements(), // side effect epic
  )
}
