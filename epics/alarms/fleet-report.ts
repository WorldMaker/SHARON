import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { concatMap, groupBy, ignoreElements, mergeMap } from 'rxjs/operators'
import { AlarmPlayerActivityAction } from '../../actions/player'
import { AlarmShipBabyAction, AlarmShipLowAction, AlarmShipVeryLowAction } from '../../actions/ship'
import { Action, ActionType } from '../../actions'
import { Store } from '../../models/store'
import actionReport from '../../reports/actions'
import { DiscordDependency, sendFleetStatus } from '../model'

type ReportActions = AlarmPlayerActivityAction
  | AlarmShipBabyAction
  | AlarmShipLowAction
  | AlarmShipVeryLowAction

export default function reportFleetAlarmsEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType<Action, ReportActions>(
      ActionType.AlarmPlayerActivity,
      ActionType.AlarmShipBaby,
      ActionType.AlarmShipLow,
      ActionType.AlarmShipVeryLow
    ),
    groupBy(action => action.fleet.id),
    mergeMap(g => g.pipe(
      concatMap(action => from(sendFleetStatus(
        client,
        action.fleet.guildId,
        action.fleet.id,
        actionReport(action)[1]
      )))
    )),
    ignoreElements() // side effect epic
  )
}
