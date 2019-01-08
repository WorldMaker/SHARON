import { distanceInWordsToNow, subMilliseconds } from 'date-fns'
import { Player } from '../models/store/player'

export default function playerStatus (player: Player) {
  const alarms = player.alarms || {}
  const activityAlarm = alarms.activityDuration ? ` 🕰${distanceInWordsToNow(subMilliseconds(new Date(), alarms.activityDuration))}` : ''
  return `${player.info.name}${activityAlarm}`
}
