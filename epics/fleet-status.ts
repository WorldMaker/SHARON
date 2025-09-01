import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { concatMap, debounceTime, groupBy, ignoreElements, mergeMap } from 'rxjs/operators'
import { Action, ActionType } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import fleetStatus from '../reports/fleet-status.ts'
import { DiscordDependency, sendFleetStatus } from './model.ts'

export default function reportFleetStatusEpic (action: Observable<Action>, state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType(
      ActionType.CheckFleet,
      ActionType.AlarmPlayerActivity,
      ActionType.AlarmShipBaby,
      ActionType.AlarmShipLow,
      ActionType.AlarmShipVeryLow,
      ActionType.ActivePlayer,
      ActionType.DeactivePlayer,
      ActionType.JoinedShip,
      ActionType.LeftShip,
      ActionType.UnalarmShipBaby,
      ActionType.UnalarmShipLow
    ),
    groupBy(action => action.fleet.id),
    mergeMap(g => g.pipe(
      debounceTime(15 /* s */ * 1000 /* ms */),
      concatMap(action => from(sendFleetStatus(
        client,
        action.fleet.guildId,
        action.fleet.id,
        fleetStatus(state.value.guilds[action.fleet.guildId].fleets[action.fleet.id])
      )))
    )),
    ignoreElements() // side effect epic
  )
}
