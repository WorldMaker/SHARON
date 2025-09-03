import * as Discord from 'discord.js'
import { ChannelType } from './channel-type.ts'
import { nlp } from './index.ts'
import { ShipInfo, shipTypes } from './ship.ts'

export interface GuildShipInfo extends ShipInfo {
  /**
   * The ID of the Ship in Rare's systems.
   *
   * These seem to be GUIDs, but easiest to treat it as an opaque string.
   */
  rareId: string
}

/**
 * Represents a Ship in Rare's systems.
 */
export interface RareGuildShip {
  /**
   * The ID of the Ship in Rare's systems.
   */
  Id: string

  /**
   * The name of the Ship.
   */
  Name: string

  /**
   * The type of the Ship.
   */
  Type: string

  /**
   * The sailing state of the Ship.
   *
   * This would be real nice if we could get real-time updates on the sailing state.
   */
  SailingState?: string

  /**
   * The sail image of the Ship.
   *
   * I wonder if we could display these in Discord somewhere.
   */
  SailImage?: string

  /**
   * The alignment of the Ship.
   *
   * Seems to be the Title of the ship, but not exactly. (Doesn't include "Legendary", for instance)
   */
  Alignment?: string
}

export interface RareGuildShipsResponse {
  Ships: RareGuildShip[]
}

export function getGuildShipInfo(
  guildId: string,
  fleetId: string,
  id: string,
  ship: RareGuildShip,
): GuildShipInfo {
  const shipType = nlp(ship.Type).match('#Ship').out('normal')
  return {
    type: ChannelType.Ship,
    id,
    rareId: ship.Id,
    name: ship.Name,
    guildId,
    fleetId,
    shipType,
    number: null,
  }
}

export function getGuildShipChannelName(ship: GuildShipInfo): string {
  const spots = shipTypes[ship.shipType]?.total
  switch (spots) {
    case 4:
      return `${ship.name} 4️⃣`
    case 3:
      return `${ship.name} 3️⃣`
    case 2:
      return `${ship.name} 2️⃣`
    default:
      return ship.name
  }
}
