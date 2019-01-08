import { distanceInWordsToNow, subMilliseconds } from 'date-fns'
import { StateObservable } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { map, concatMap, ignoreElements, groupBy, mergeMap, bufferTime } from 'rxjs/operators'
import { Action, ActionType } from '../actions'
import { Store } from '../models/store'
import { DiscordDependency, log } from './model'

export const BasicLogInterval = 2 /* s */ * 1000 /* ms */

function basicLogMessage (action: Action) {
  switch (action.type) {
    case ActionType.ActivePlayer:
      return [action.fleet.guildId, `${action.player.name} is **active** on ${action.fleet.name} ${action.ship.name}`]
    case ActionType.AddedShip:
      return [action.fleet.guildId, `**Added ship:** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.AlarmPlayerActivity:
      return [action.fleet.guildId, `🚨 ${action.player.name} has been active for ${distanceInWordsToNow(subMilliseconds(new Date(), action.duration))}`]
    case ActionType.AlarmShipBaby:
      return [action.fleet.guildId, `🚨 ${action.fleet.name} ${action.ship.name} has ${action.babies} Discord babies`]
    case ActionType.AlarmShipLow:
      return [action.fleet.guildId, `🚨 ${action.fleet.name} ${action.ship.name} is **low** at ${action.spots} players left`]
    case ActionType.AlarmShipVeryLow:
      return [action.fleet.guildId, `🚨 ${action.fleet.name} ${action.ship.name} is **very low** at ${action.spots} players left`]
    case ActionType.ChangedShip:
      return [action.fleet.guildId, `**Ship change:** ${action.fleet.name} ${action.oldShip.name} ➡ ${action.ship.name}`]
    case ActionType.CheckGuild:
      return [action.guildId, '**Reviewing all fleets**']
    case ActionType.CheckFleet:
      return [action.fleet.guildId, `👓 Reviewing fleet: ${action.fleet.name}`]
    case ActionType.CheckShip:
      return [action.ship.guildId, `👓 Reviewing ship status: ${action.fleet.name} ${action.ship.name}`]
    case ActionType.ClosedFleet:
      return [action.fleet.guildId, `**Closed fleet:** ${action.fleet.name}`]
    case ActionType.DeactivePlayer:
      return [action.fleet.guildId, `${action.player.name} is **inactive** on ${action.fleet.name} ${action.ship.name}`]
    case ActionType.DroppedShip:
      return [action.fleet.guildId, `**Dropped ship:** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.JoinedShip:
      return [action.fleet.guildId, `${action.player.name} **joined** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.LeftShip:
      return [action.fleet.guildId, `${action.player.name} **left** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.NewFleet:
      return [action.fleet.guildId, `**New fleet:** ${action.fleet.name}`]
    case ActionType.UnalarmShipBaby:
      return [action.fleet.guildId, `${action.fleet.name} ${action.ship.name} is no longer full of Discord babies`]
    case ActionType.UnalarmShipLow:
      return [action.fleet.guildId, `${action.fleet.name} ${action.ship.name} has filled back up`]
  }
  return [null, action.type]
}

export default function basicLoggingEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    map(basicLogMessage),
    groupBy(([guildId]) => guildId, ([, message]) => message),
    mergeMap(group => group.pipe(
      bufferTime(BasicLogInterval),
      map(buffer => [group.key, buffer.join('\n')])
    )),
    concatMap(([guildId, message]) => from(log(client, guildId, message))),
    ignoreElements()
  )
}
