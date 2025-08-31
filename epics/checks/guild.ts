import { StateObservable, ofType } from 'redux-observable'
import { Observable, from, merge } from 'rxjs'
import { map, concatMap, filter } from 'rxjs/operators'
import { CheckGuildAction } from '../../actions/guild.ts'
import { Action, ActionType, checkFleet, newFleet } from '../../actions/index.ts'
import { getChannelInfo, isFleet } from '../../models/channel.ts'
import { Store } from '../../models/store/index.ts'
import { DiscordDependency } from '../model.ts'

export default function checkGuildEpic (action: Observable<Action>, state: StateObservable<Store>, { client }: DiscordDependency) {
  const checkGuilds = action.pipe(
    ofType<Action, CheckGuildAction>(ActionType.CheckGuild)
  )

  const newFleets = checkGuilds.pipe(
    concatMap(({ guildId }) => {
      const guild = client.guilds.get(guildId)
      if (guild && guild.available) {
        return from(guild.channels.values())
      }
      return from([])
    }),
    map(channel => getChannelInfo(channel)),
    filter(isFleet),
    filter(fleet => !state.value.guilds[fleet.guildId].fleets[fleet.id]),
    concatMap(fleet => from([
      newFleet(fleet),
      checkFleet(fleet)
    ]))
  )

  const existingFleets = checkGuilds.pipe(
    concatMap(({ guildId }) => {
      const guild = state.value.guilds[guildId]
      if (guild) {
        return from(Object.keys(guild.fleets).map(key => guild.fleets[key].info))
      }
      return from([])
    }),
    map(fleet => checkFleet(fleet))
  )

  return merge(newFleets, existingFleets)
}
