import { FleetStore } from './fleet.ts'
import { GuildShipStore } from './guild-ship.ts'

export interface GuildStore {
  readonly [guildId: string]: {
    readonly fleets: FleetStore
    readonly guildShips?: GuildShipStore
  }
}

export interface Store {
  readonly guilds: GuildStore
}

export const initialState: Store = {
  guilds: {},
}
