import { ShipInfo } from '../ship'

export interface ShipPlayerStore {
  readonly [id: string]: string | undefined
}

export interface ShipStore {
  readonly [shipId: string]: {
    readonly info: ShipInfo
    readonly active: ShipPlayerStore
    readonly leaving: ShipPlayerStore
    readonly left: ShipPlayerStore
    readonly visiting: ShipPlayerStore
    readonly alarms?: {
      readonly babies?: number
      readonly low?: number
    }
  }
}
