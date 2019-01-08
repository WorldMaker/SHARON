import { differenceInMilliseconds } from 'date-fns'
import { PlayerInfo } from '../player'

export interface ActivityLog {
  readonly time: string
  readonly shipId: string
  readonly isActive: boolean
}

export interface Player {
  readonly info: PlayerInfo
  readonly activity?: ReadonlyArray<ActivityLog>
  readonly alarms?: {
    activityDuration?: number
  }
}

export interface PlayerStore {
  readonly [id: string]: Player
}

interface ActivityDurationAccumulator {
  duration: number
  lastActiveSeen: string | null
}

export function getPlayerActivityDuration (activity: ReadonlyArray<ActivityLog> | null | undefined): number {
  if (!activity) {
    return 0
  }
  return activity.reduce((acc, cur) => {
    if (!cur.isActive && acc.lastActiveSeen) {
      return { duration: acc.duration + differenceInMilliseconds(cur.time, acc.lastActiveSeen), lastActiveSeen: null }
    }
    if (cur.isActive && !acc.lastActiveSeen) {
      return { duration: acc.duration, lastActiveSeen: cur.time }
    }
    return acc
  },
    { duration: 0, lastActiveSeen: null } as ActivityDurationAccumulator)
    .duration
}
