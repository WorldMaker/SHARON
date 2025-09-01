import { formatDistanceToNow, subMilliseconds } from 'date-fns'
import { Player } from '../models/store/player.ts'

export default function playerStatus(player: Player) {
  const alarms = player.alarms || {}
  const activityAlarm = alarms.activityDuration
    ? ` 🕰${
      formatDistanceToNow(subMilliseconds(new Date(), alarms.activityDuration))
    }`
    : ''
  return `${player.info.name}${activityAlarm}`
}
