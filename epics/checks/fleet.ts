import { CategoryChannel } from 'discord.js'
import { StateObservable, ofType } from 'redux-observable'
import { Observable, from, of } from 'rxjs'
import { map, concatMap } from 'rxjs/operators'
import { CheckFleetAction, closedFleet, newFleet } from '../../actions/fleet'
import { Action, ActionType, checkFleet, addedShip, checkShip } from '../../actions'
import { getChannelInfo, isFleet, isShip } from '../../models/channel'
import { Store } from '../../models/store'
import { DiscordDependency } from '../model'

export default function checkFleetEpic (action: Observable<Action>, state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType<Action, CheckFleetAction>(ActionType.CheckFleet),
    map(action => {
      const channel = client.channels.get(action.fleet.id)
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
          checkFleet(info)
        ])
      }
      const fleet = state.value.guilds[action.fleet.guildId].fleets[action.fleet.id]
      const checkShips = Object.keys(fleet.ships)
        .map(key => checkShip(info, fleet.ships[key].info) as Action)
      for (let subChannel of (channel as CategoryChannel).children.values()) {
        const subInfo = getChannelInfo(subChannel)
        if (subInfo && isShip(subInfo) && !fleet.ships[subInfo.id]) {
          checkShips.push(addedShip(info, subInfo), checkShip(info, subInfo))
        }
      }
      return from(checkShips)
    })
  )
}
