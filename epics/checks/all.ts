import { ofType, StateObservable } from 'redux-observable'
import { from, Observable } from 'rxjs'
import { concatMap, map } from 'rxjs/operators'
import { Action, ActionType, checkGuild } from '../../actions/index.ts'
import { Store } from '../../models/store/index.ts'
import { DiscordDependency } from '../model.ts'

export default function checkAllEpic(
  action: Observable<Action>,
  _state: StateObservable<Store>,
  { client }: DiscordDependency,
) {
  return action.pipe(
    ofType(ActionType.CheckAll),
    concatMap(() =>
      from(client.guilds.fetch().then((guilds) => guilds.keys()))
    ),
    concatMap((keys) => from(keys)),
    map((guildId) => checkGuild(guildId)),
  )
}
