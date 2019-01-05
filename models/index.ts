import nlp from 'compromise'
import * as nlpPlugin from './compromise-plugin.json'
import { ChannelType } from './channel-type'
import { FleetInfo } from './fleet'
import { PlayerInfo } from './player'
import { ShipInfo } from './ship'

nlp.plugin(nlpPlugin)

export {
  ChannelType,
  FleetInfo,
  PlayerInfo,
  ShipInfo,
  nlp
}
