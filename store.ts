import { FleetInfo, ShipInfo, PlayerInfo } from './model'

export interface PlayerStore {
  readonly [id: string]: {
    readonly info: PlayerInfo
  }
}

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
  }
}

export interface FleetStore {
  readonly [fleetId: string]: {
    readonly active: boolean
    readonly info: FleetInfo
    readonly ships: ShipStore
    readonly players: PlayerStore
  }
}

export interface GuildStore {
  readonly [guildId: string]: {
    readonly fleets: FleetStore
  }
}

export interface Store {
  readonly guilds: GuildStore
}
