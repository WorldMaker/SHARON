import { CategoryChannel } from 'discord.js'
import { ofType, StateObservable } from 'redux-observable'
import { from, Observable, of } from 'rxjs'
import { concatMap, map } from 'rxjs/operators'
import { closedFleet, newFleet } from '../../actions/fleet.ts'
import {
  Action,
  ActionType,
  addedShip,
  checkFleet,
  checkShip,
} from '../../actions/index.ts'
import { getChannelInfo, isFleet, isShip } from '../../models/channel.ts'
import { Store } from '../../models/store/index.ts'
import { DiscordDependency } from '../model.ts'

export default function checkFleetEpic(
  action: Observable<Action>,
  state: StateObservable<Store>,
  { client }: DiscordDependency,
) {
  return action.pipe(
    ofType(ActionType.CheckFleet),
    map((action) => {
      const channel = client.channels.resolve(action.fleet.id)
      return { action, channel, info: channel ? getChannelInfo(channel) : null }
    }),
    concatMap(({ action, channel, info }) => {
      if (!channel || !isFleet(info)) {
        return of(closedFleet(action.fleet))
      }
      if (action.fleet.name !== info.name) {
        return from([
          closedFleet(action.fleet),
          newFleet(info),
          checkFleet(info),
        ])
      }
      const fleet =
        state.value.guilds[action.fleet.guildId].fleets[action.fleet.id]
      const checkShips = Object.keys(fleet.ships)
        .map((key) => checkShip(info, fleet.ships[key].info) as Action)
      for (const subChannel of (channel as CategoryChannel).children.valueOf().values()) {
        const subInfo = getChannelInfo(subChannel)
        if (subInfo && isShip(subInfo) && !fleet.ships[subInfo.id]) {
          checkShips.push(addedShip(info, subInfo), checkShip(info, subInfo))
        }
      }
      return from(checkShips)
    }),
  )
}
