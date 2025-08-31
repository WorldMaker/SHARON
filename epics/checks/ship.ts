import { differenceInMilliseconds } from 'date-fns'
import { VoiceChannel } from 'discord.js'
import { StateObservable, ofType } from 'redux-observable'
import { Observable, from, of } from 'rxjs'
import { map, concatMap } from 'rxjs/operators'
import { joinedShip, leftShip, activePlayer, deactivePlayer } from '../../actions/player.ts'
import { CheckShipAction, changedShip, checkShip, droppedShip } from '../../actions/ship.ts'
import { Action, ActionType } from '../../actions/index.ts'
import { getChannelInfo, isShip } from '../../models/channel.ts'
import { getPlayerInfo } from '../../models/player.ts'
import { Store } from '../../models/store/index.ts'
import { DiscordDependency } from '../model.ts'
import { ActivityInterval } from '../player-activity.ts'

export default function checkShipEpic (action: Observable<Action>, state: StateObservable<Store>, { client }: DiscordDependency) {
  return action.pipe(
    ofType<Action, CheckShipAction>(ActionType.CheckShip),
    map(action => {
      const channel = client.channels.get(action.ship.id)
      return { action, channel, info: channel ? getChannelInfo(channel) : null }
    }),
    concatMap(({ action, channel, info }) => {
      if (!channel || !isShip(info)) {
        return of(droppedShip(action.fleet, action.ship) as Action)
      }
      if (action.ship.name !== info.name) {
        return from([
          changedShip(action.fleet, action.ship, info),
          checkShip(action.fleet, info)
        ])
      }
      const ship = state.value.guilds[action.fleet.guildId].fleets[action.fleet.id].ships[action.ship.id]
      const leftPlayers = [...Object.keys(ship.active), ...Object.keys(ship.visiting)]
        .filter(key => !(channel as VoiceChannel).members.has(key))
        .map(key => {
          const member = (channel as VoiceChannel).guild.members.get(key)
          return leftShip(action.fleet, action.ship, member
            ? getPlayerInfo(action.fleet, action.ship, member)
            : {
              fleetId: action.fleet.id,
              guildId: action.fleet.guildId,
              shipId: action.ship.id,
              id: key,
              hoistRoleName: null,
              name: `<@${key}>`,
              username: `<@${key}>`
            })
        })
      const joinPlayers = (channel as VoiceChannel).members.array()
        .filter(member => !ship.active[member.id] || !ship.visiting[member.id])
        .map(member => joinedShip(action.fleet, action.ship, getPlayerInfo(action.fleet, action.ship, member)))
      const activePlayers = [...Object.keys(ship.visiting)]
        .filter(key => (channel as VoiceChannel).members.has(key)
          && differenceInMilliseconds(new Date(), ship.visiting[key]!) >= ActivityInterval)
        .map(key => {
          const member = (channel as VoiceChannel).guild.members.get(key)
          return activePlayer(action.fleet, action.ship, getPlayerInfo(action.fleet, action.ship, member!))
        })
      const deactivePlayers = [...Object.keys(ship.leaving)]
        .filter(key => !(channel as VoiceChannel).members.has(key)
          && differenceInMilliseconds(new Date(), ship.visiting[key]!) >= ActivityInterval)
        .map(key => {
          const member = (channel as VoiceChannel).guild.members.get(key)
          return deactivePlayer(action.fleet, action.ship, getPlayerInfo(action.fleet, action.ship, member!))
        })
      return from([
        ...leftPlayers,
        ...joinPlayers,
        ...activePlayers,
        ...deactivePlayers
      ])
    })
  )
}
