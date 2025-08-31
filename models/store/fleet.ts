import { FleetInfo } from '../index.ts'
import { PlayerStore } from './player.ts'
import { ShipStore } from './ship.ts'

export interface Fleet {
  readonly active: boolean
  readonly info: FleetInfo
  readonly ships: ShipStore
  readonly players: PlayerStore
}

export interface FleetStore {
  readonly [fleetId: string]: Fleet
}
