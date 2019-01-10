import { StateObservable, ofType } from 'redux-observable'
import { Observable, from } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { ActivePlayerAction, DeactivePlayerAction } from '../../actions/player'
import { CheckShipAction, alarmShipBaby, unalarmShipBaby, alarmShipLow, alarmShipVeryLow, unalarmShipLow } from '../../actions/ship'
import { Action, ActionType } from '../../actions'
import { shipTypes } from '../../models/ship'
import { Store } from '../../models/store'

const DefaultBabySpots = Infinity // "don't worry about it"
const DefaultLowSpots = -1
const DefaultVeryLowSpots = -1

export default function shipCountAlarmsEpic (action: Observable<Action>, state: StateObservable<Store>) {
  return action.pipe(
    ofType<Action, CheckShipAction | ActivePlayerAction | DeactivePlayerAction>(ActionType.CheckShip, ActionType.ActivePlayer, ActionType.DeactivePlayer),
    concatMap(action => {
      let alarms: Action[] = []
      const ship = state.value.guilds[action.fleet.guildId].fleets[action.fleet.id].ships[action.ship.id]
      const shipType = shipTypes[ship.info.shipType] || {}
      const activePlayers = [...Object.keys(ship.active)]
        .map(key => state.value.guilds[action.fleet.guildId].fleets[action.fleet.id].players[key])
      const babies = activePlayers.filter(player => !player.info.hoistRoleName).length
      if (babies >= (shipType.babySpots || DefaultBabySpots) && !(ship.alarms && ship.alarms.babies)) {
        alarms.push(alarmShipBaby(action.fleet, action.ship, babies))
      } else if (ship.alarms && ship.alarms.babies) {
        alarms.push(unalarmShipBaby(action.fleet, action.ship))
      }
      const lowSpots = shipType.lowSpots || DefaultLowSpots
      if (activePlayers.length <= lowSpots && !(ship.alarms && ship.alarms.low)) {
        alarms.push(alarmShipLow(action.fleet, action.ship, activePlayers.length))
      }
      const veryLowSpots = shipType.veryLowSpots || DefaultVeryLowSpots
      if (activePlayers.length <= veryLowSpots) {
        alarms.push(alarmShipVeryLow(action.fleet, action.ship, activePlayers.length))
      }
      if (ship.alarms && ship.alarms.low && activePlayers.length > lowSpots) {
        alarms.push(unalarmShipLow(action.fleet, action.ship))
      }
      return from(alarms)
    })
  )
}
