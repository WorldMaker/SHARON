import { FleetInfo } from '../index'
import { PlayerStore } from './player'
import { ShipStore } from './ship'

export interface FleetStore {
  readonly [fleetId: string]: {
    readonly active: boolean
    readonly info: FleetInfo
    readonly ships: ShipStore
    readonly players: PlayerStore
  }
}
