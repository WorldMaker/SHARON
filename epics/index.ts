import { combineEpics } from 'redux-observable'
import reportFleetAlarmsEpic from './alarms/fleet-report'
import playerActivityAlarmEpic from './alarms/player-activity'
import shipCountAlarmsEpic from './alarms/ship-counts'
import basicLoggingEpic from './basic-logging'
import checkAllEpic from './checks/all'
import checkGuildEpic from './checks/guild'
import checkFleetEpic from './checks/fleet'
import checkShipEpic from './checks/ship'
import checkSometimesEpic from './checks/sometimes'
import reportFleetStatusEpic from './fleet-status'
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
  playerActivityAlarmEpic,
  reportFleetAlarmsEpic,
  reportFleetStatusEpic,
  shipCountAlarmsEpic,
  storageEpic
)

export default rootEpic
