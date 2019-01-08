import { PlayerStore } from '../models/store/player'
import { Ship } from '../models/store/ship'
import { shipTypes } from '../models/ship'
import playerStatus from './player-status'

export default function shipStatus (ship: Ship, players: PlayerStore) {
  const alarms = ship.alarms || {}
  const shipType = shipTypes[ship.info.shipType] || {}
  const shipBabyAlarm = alarms.babies ? ` 👶${alarms.babies}/${shipType.total}` : ''
  const shipLowAlarm = alarms.low || alarms.low === 0 ? `${alarms.low <= shipType.veryLowSpots ? ' 🚨👤' : ' 👤'}${alarms.low}/${shipType.total}` : ''
  const activePlayerStatus = [...Object.keys(ship.active)]
    .map(key => playerStatus(players[key]))
    .join(', ')
  const visitingPlayers = [...Object.keys(ship.visiting)]
    .map(key => players[key].info.name)
    .join(', ')
  const leavingPlayers = [...Object.keys(ship.leaving)]
    .map(key => players[key].info.name)
    .join(', ')
  return `**${ship.info.name}**${shipLowAlarm}${shipBabyAlarm}
${activePlayerStatus}${visitingPlayers ? ` ⤴${visitingPlayers}` : ''}${leavingPlayers ? ` ⤵${leavingPlayers}` : ''}`
}
