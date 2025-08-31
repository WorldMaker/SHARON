import { combineEpics } from 'redux-observable'
import reportFleetAlarmsEpic from './alarms/fleet-report.ts'
import playerActivityAlarmEpic from './alarms/player-activity.ts'
import shipCountAlarmsEpic from './alarms/ship-counts.ts'
import basicLoggingEpic from './basic-logging.ts'
import checkAllEpic from './checks/all.ts'
import checkGuildEpic from './checks/guild.ts'
import checkFleetEpic from './checks/fleet.ts'
import checkShipEpic from './checks/ship.ts'
import checkSometimesEpic from './checks/sometimes.ts'
import reportFleetStatusEpic from './fleet-status.ts'
import playerActivityEpic from './player-activity.ts'
import storageEpic from './storage.ts'

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
