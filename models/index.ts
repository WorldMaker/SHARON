import nlp from 'compromise'
import nlpPlugin from './compromise-plugin.json' with { type: 'json' }
import { ChannelType } from './channel-type.ts'
import { FleetInfo } from './fleet.ts'
import { PlayerInfo } from './player.ts'
import { ShipInfo } from './ship.ts'

nlp.plugin(nlpPlugin)

export { ChannelType, type FleetInfo, nlp, type PlayerInfo, type ShipInfo }
