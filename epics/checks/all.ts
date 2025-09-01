import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { map, concatMap } from 'rxjs/operators'
import { Action, checkGuild, ActionType } from '../../actions/index.ts'
import { Store } from '../../models/store/index.ts'
import { DiscordDependency } from '../model.ts'

export default function checkAllEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType(ActionType.CheckAll),
    concatMap(() => from(client.guilds.keys())),
    map(guildId => checkGuild(guildId))
  )
}
