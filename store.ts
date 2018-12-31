import { FleetInfo, ShipInfo, PlayerInfo } from './model'

export interface PlayerStore {
  readonly [id: string]: {
    readonly info: PlayerInfo
  }
}

export interface ShipStore {
  readonly [shipId: string]: {
    readonly info: ShipInfo
    readonly active: PlayerStore
    readonly leaving: PlayerStore
    readonly left: PlayerStore
    readonly visiting: PlayerStore
  }
}

export interface FleetStore {
  readonly [fleetId: string]: {
    readonly active: boolean
    readonly info: FleetInfo
    readonly ships: ShipStore
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
