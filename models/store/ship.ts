import { ShipInfo } from '../ship.ts'

export interface ShipPlayerStore {
  readonly [id: string]: string | undefined
}

export interface Ship {
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

export interface ShipStore {
  readonly [shipId: string]: Ship
}
