import { Fleet } from '../models/store/fleet'
import shipStatus from './ship-status'

export default function fleetStatus (fleet: Fleet) {
  return [...Object.keys(fleet.ships)]
    .map(key => shipStatus(fleet.ships[key], fleet.players))
    .join('\n')
}
