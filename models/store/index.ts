import { FleetStore } from './fleet'

export interface GuildStore {
  readonly [guildId: string]: {
    readonly fleets: FleetStore
  }
}

export interface Store {
  readonly guilds: GuildStore
}
