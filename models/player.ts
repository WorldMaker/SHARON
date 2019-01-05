import { GuildMember } from 'discord.js'
import { FleetInfo, ShipInfo } from './index'

export interface PlayerInfo {
  fleetId: string
  guildId: string
  shipId: string | null
  id: string
  hoistRoleName: string | null
  name: string
  username: string
}

export function getPlayerInfo (fleet: FleetInfo, ship: ShipInfo | null, player: GuildMember): PlayerInfo {
  return {
    fleetId: fleet.id,
    guildId: fleet.guildId,
    shipId: ship && ship.id,
    id: player.id,
    hoistRoleName: player.hoistRole ? player.hoistRole.name : null,
    name: player.displayName,
    username: player.user.username
  }
}
