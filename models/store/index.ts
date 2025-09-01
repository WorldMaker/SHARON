import { FleetStore } from './fleet.ts'

export interface GuildStore {
  readonly [guildId: string]: {
    readonly fleets: FleetStore
  }
}

export interface Store {
  readonly guilds: GuildStore
}

export const initialState: Store = {
  guilds: {},
}
