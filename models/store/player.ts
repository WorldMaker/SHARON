import { PlayerInfo } from '../player'

export interface ActivityLog {
  readonly time: string
  readonly shipId: string
  readonly isActive: boolean
}

export interface PlayerStore {
  readonly [id: string]: {
    readonly info: PlayerInfo
    readonly activity?: ReadonlyArray<ActivityLog>
  }
}
