import { CategoryChannel, TextChannel } from 'discord.js'
import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { concatMap, debounceTime, groupBy, ignoreElements, mergeMap } from 'rxjs/operators'
import { AlarmPlayerActivityAction, ActivePlayerAction, DeactivePlayerAction, JoinedShipAction, LeftShipAction } from '../actions/player'
import { AlarmShipBabyAction, AlarmShipLowAction, AlarmShipVeryLowAction, UnalarmShipBabyAction, UnalarmShipLowAction } from '../actions/ship'
import { CheckFleetAction } from '../actions/fleet'
import { Action, ActionType } from '../actions'
import { Store } from '../models/store'
import { ShoutMode, DiscordDependency } from './model'
import fleetStatus from '../reports/fleet-status';

const FleetStatusChannel = 'fleet-status'

type ReportActions = CheckFleetAction
  | AlarmPlayerActivityAction
  | AlarmShipBabyAction
  | AlarmShipLowAction
  | AlarmShipVeryLowAction
  | ActivePlayerAction
  | DeactivePlayerAction
  | JoinedShipAction
  | LeftShipAction
  | UnalarmShipBabyAction
  | UnalarmShipLowAction

export default function reportFleetStatusEpic (action: Observable<Action>, state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType<Action, ReportActions>(
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
      concatMap(action => from((async () => {
        const guild = client.guilds.get(action.fleet.guildId)
        if (guild) {
          const fleet = guild.channels.get(action.fleet.id)
          if (fleet && fleet instanceof CategoryChannel) {
            const statusChannel = fleet.children.find(c => c.name === FleetStatusChannel)
            if (statusChannel && statusChannel instanceof TextChannel) {
              const status = fleetStatus(state.value.guilds[action.fleet.guildId].fleets[action.fleet.id])
              await statusChannel.send(ShoutMode ? status.toLocaleUpperCase() : status)
            }
          }
        }
      })()))
    )),
    ignoreElements() // side effect epic
  )
}
