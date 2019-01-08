import { FleetInfo } from '../index'
import { PlayerStore } from './player'
import { ShipStore } from './ship'

export interface Fleet {
  readonly active: boolean
  readonly info: FleetInfo
  readonly ships: ShipStore
  readonly players: PlayerStore
}

export interface FleetStore {
  readonly [fleetId: string]: Fleet
}
