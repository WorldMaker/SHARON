import { VoiceChannel } from 'discord.js'
import { ChannelType, nlp, View } from './index.ts'

export type ShipType =
  | 'gal'
  | 'galleon'
  | 'brig'
  | 'brigantine'
  | 'sloop'
  | 'ship'

export interface ShipInfo {
  type: ChannelType.Ship
  fleetId: string
  guildId: string
  id: string
  name: string
  shipType: ShipType
  number: number | null
}

interface ShipTypeStats {
  readonly total: number
  readonly babySpots: number
  readonly lowSpots: number
  readonly veryLowSpots: number
}

interface ShipTypeLookup {
  readonly [id: string]: ShipTypeStats
}

export const shipTypes: ShipTypeLookup = Object.freeze({
  gal: Object.freeze({
    normative: 'galleon',
    total: 4,
    babySpots: 3,
    lowSpots: 2,
    veryLowSpots: 1,
  }),
  galleon: Object.freeze({
    total: 4,
    babySpots: 3,
    lowSpots: 2,
    veryLowSpots: 1,
  }),
  brig: Object.freeze({
    normative: 'brigantine',
    total: 3,
    babySpots: 3,
    lowSpots: 1,
    veryLowSpots: 0,
  }),
  brigantine: Object.freeze({
    total: 3,
    babySpots: 3,
    lowSpots: 1,
    veryLowSpots: 0,
  }),
  sloop: Object.freeze({
    total: 2,
    babySpots: 1,
    lowSpots: 0,
    veryLowSpots: -1,
  }),
})

export function getShipInfo(ship: VoiceChannel, doc: View | null = null): ShipInfo {
  if (!doc) {
    doc = nlp(ship.name)
  }
  const values = doc.numbers().get(0)
  return {
    type: ChannelType.Ship,
    fleetId: ship.parent!.id,
    guildId: ship.guild.id,
    id: ship.id,
    name: ship.name,
    shipType: doc.match('#Ship').out('normal'),
    number: values && typeof values === 'number' ? values : null,
  }
}
