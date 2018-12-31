import { combineEpics } from 'redux-observable'
import basicLoggingEpic from './basic-logging'

const rootEpic = combineEpics(
  basicLoggingEpic
)

export default rootEpic
