import * as Discord from 'discord.js'
import { Dispatch } from 'redux'
import { Action, closedFleet, newFleet, checkFleet, droppedShip, addedShip, changedShip } from '../actions'
import { getChannelInfo } from '../models/channel'
import { getFleetInfo } from '../models/fleet'
import { ChannelType } from '../models'

export default function channelUpdate (dispatch: Dispatch<Action>, oldChannel: Discord.Channel, newChannel: Discord.Channel) {
  const oldInfo = getChannelInfo(oldChannel)
  const newInfo = getChannelInfo(newChannel)
  if (oldInfo && oldInfo.type === ChannelType.Fleet) {
    dispatch(closedFleet(oldInfo))
  }
  if (newInfo && newInfo.type === ChannelType.Fleet) {
    dispatch(newFleet(newInfo))
    dispatch(checkFleet(newInfo))
  }
  if (oldInfo && oldInfo.type === ChannelType.Ship && (!newInfo || newInfo.type !== ChannelType.Ship)) {
    const fleet = getFleetInfo((oldChannel as Discord.GuildChannel).parent)
    dispatch(droppedShip(fleet, oldInfo))
  }
  if (newInfo && newInfo.type === ChannelType.Ship && (!oldInfo || oldInfo.type !== ChannelType.Ship)) {
    const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
    dispatch(addedShip(fleet, newInfo))
  }
  if (oldInfo && newInfo && oldInfo.type === ChannelType.Ship && newInfo.type === ChannelType.Ship) {
    const fleet = getFleetInfo((newChannel as Discord.GuildChannel).parent)
    dispatch(changedShip(fleet, oldInfo, newInfo))
  }
}
