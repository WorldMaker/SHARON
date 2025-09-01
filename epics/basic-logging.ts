import { StateObservable } from 'redux-observable'
import { from, Observable } from 'rxjs'
import {
  bufferTime,
  concatMap,
  groupBy,
  ignoreElements,
  map,
  mergeMap,
} from 'rxjs/operators'
import { Action } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import actionReport from '../reports/actions.ts'
import { DiscordDependency, log } from './model.ts'

export const BasicLogInterval = 2 /* s */ * 1000 /* ms */

export default function basicLoggingEpic(
  action: Observable<Action>,
  _state: StateObservable<Store>,
  { client }: DiscordDependency,
) {
  return action.pipe(
    map(actionReport),
    groupBy(([guildId]) => guildId, ([, message]) => message),
    mergeMap((group) =>
      group.pipe(
        bufferTime(BasicLogInterval),
        map((buffer) => [group.key, buffer.join('\n')]),
      )
    ),
    concatMap(([guildId, message]) => from(log(client, guildId, message))),
    ignoreElements(),
  )
}
