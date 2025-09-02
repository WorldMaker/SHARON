import { GuildShipInfo } from '../guild-ship.ts'

export interface GuildShip {
  readonly info: GuildShipInfo
  /*
  Would it be as useful to track this for Guild ships?

  readonly active: ShipPlayerStore
  readonly leaving: ShipPlayerStore
  readonly left: ShipPlayerStore
  readonly visiting: ShipPlayerStore
  readonly alarms?: {
    readonly babies?: number
    readonly low?: number
  }
  */
}

export interface GuildShipStore {
  readonly [shipRareId: string]: GuildShip
}
