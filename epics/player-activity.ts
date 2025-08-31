import { StateObservable, ofType } from 'redux-observable'
import { Observable, merge, of, from, race } from 'rxjs'
import { mergeMap, delay, takeUntil, last, filter } from 'rxjs/operators'
import { JoinedShipAction, LeftShipAction, activePlayer, deactivePlayer } from '../actions/player.ts'
import { Action, ActionType } from '../actions/index.ts'
import { Store } from '../models/store/index.ts'
import { DiscordDependency } from './model.ts'

export const ActivityInterval = 5 /* m */ * 60 /* s */ * 1000 /* ms */

export default function playerActivityEpic (action: Observable<Action>, _state: StateObservable<Store>, { client }: DiscordDependency) {
  const activePlayers = action.pipe(
    ofType<Action, JoinedShipAction>(ActionType.JoinedShip),
    mergeMap(joinedShip => of(joinedShip).pipe(
      takeUntil(race(
        action.pipe(
          ofType<Action, LeftShipAction | JoinedShipAction>(ActionType.LeftShip, ActionType.JoinedShip),
          filter(leftShip => leftShip.player.id === joinedShip.player.id)
        ),
        action.pipe(last())
      )),
      delay(ActivityInterval),
      mergeMap(joinedShip => {
        // Double check user is still connected
        const guild = client.guilds.get(joinedShip.ship.guildId)
        if (guild && guild.available) {
          const member = guild.members.get(joinedShip.player.id)
          if (member && member.voiceChannelID === joinedShip.ship.id) {
            return from([
              activePlayer(joinedShip.fleet, joinedShip.ship, joinedShip.player)
            ])
          }
        }
        return from([])
      })
    ))
  )

  const deactivePlayers = action.pipe(
    ofType<Action, LeftShipAction>(ActionType.LeftShip),
    mergeMap(leftShip => of(leftShip).pipe(
      takeUntil(race(
        action.pipe(
          ofType<Action, LeftShipAction | JoinedShipAction>(ActionType.LeftShip, ActionType.JoinedShip),
          filter(joinedShip => joinedShip.player.id === leftShip.player.id)
        ),
        action.pipe(last())
      )),
      delay(ActivityInterval),
      mergeMap(joinedShip => {
        // Double check user is still connected
        const guild = client.guilds.get(joinedShip.ship.guildId)
        if (guild && guild.available) {
          const member = guild.members.get(joinedShip.player.id)
          if (member && member.voiceChannelID !== joinedShip.ship.id) {
            return from([
              deactivePlayer(joinedShip.fleet, joinedShip.ship, joinedShip.player)
            ])
          }
        }
        return from([])
      })
    ))
  )

  return merge(activePlayers, deactivePlayers)
}
