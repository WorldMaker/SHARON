import { StateObservable } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { map, concatMap, ignoreElements } from 'rxjs/operators'
import { Action, ActionType } from '../actions'
import { Store } from '../store'
import { DiscordDependency, log } from './model'

function basicLogMessage (action: Action) {
  switch (action.type) {
    case ActionType.AddedShip:
      return [action.fleet.guildId, `**Added ship:** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.ChangedShip:
      return [action.fleet.guildId, `**Ship change:** ${action.fleet.name} ${action.oldShip.name} ➡ ${action.newShip.name}`]
    case ActionType.CheckGuild:
      return [action.guildId, '**Reviewing all fleets**']
    case ActionType.CheckFleet:
      return [action.fleet.guildId, `👓 Reviewing fleet: ${action.fleet.name}`]
    case ActionType.CheckShip:
      return [action.ship.guildId, `👓 Reviewing ship status: ${action.fleet.name} ${action.ship.name}`]
    case ActionType.ClosedFleet:
      return [action.fleet.guildId, `**Closed fleet:** ${action.fleet.name}`]
    case ActionType.DroppedShip:
      return [action.fleet.guildId, `**Dropped ship:** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.JoinedShip:
      return [action.fleet.guildId, `${action.player.name} **joined** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.LeftShip:
      return [action.fleet.guildId, `${action.player.name} **left** ${action.fleet.name} ${action.ship.name}`]
    case ActionType.NewFleet:
      return [action.fleet.guildId, `**New fleet:** ${action.fleet.name}`]
  }
  return [null, action.type]
}

export default function basicLoggingEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    map(basicLogMessage),
    concatMap(([guildId, message]) => from(log(client, guildId, message))),
    ignoreElements()
  )
}
