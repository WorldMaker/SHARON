import { combineEpics } from 'redux-observable'
import basicLoggingEpic from './basic-logging'
import checkAllEpic from './checks/all'
import checkGuildEpic from './checks/guild'
import checkFleetEpic from './checks/fleet'
import checkShipEpic from './checks/ship'
import checkSometimesEpic from './checks/sometimes'
import playerActivityEpic from './player-activity'
import storageEpic from './storage'

const rootEpic = combineEpics(
  basicLoggingEpic,
  checkAllEpic,
  checkFleetEpic,
  checkGuildEpic,
  checkShipEpic,
  checkSometimesEpic,
  playerActivityEpic,
  storageEpic
)

export default rootEpic
