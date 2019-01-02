import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { map, concatMap } from 'rxjs/operators'
import { CheckAllAction } from '../../actions/guild'
import { Action, checkGuild, ActionType } from '../../actions'
import { Store } from '../../store'
import { DiscordDependency } from '../model'

export default function checkAllEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType<Action, CheckAllAction>(ActionType.CheckAll),
    concatMap(() => from(client.guilds.keys())),
    map(guildId => checkGuild(guildId))
  )
}
