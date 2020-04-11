import * as Discord from 'discord.js'
import { Dispatch } from 'redux'
import { Action, leftShip, joinedShip } from '../actions'
import { getChannelInfo } from '../models/channel'
import { getFleetInfo } from '../models/fleet'
import { getPlayerInfo } from '../models/player'
import { ChannelType } from '../models'

export default function voiceStateUpdate (dispatch: Dispatch<Action>, oldMember: Discord.GuildMember, newMember: Discord.GuildMember) {
  if (oldMember && oldMember.voiceChannel) {
    const oldInfo = getChannelInfo(oldMember.voiceChannel)
    const oldFleet = getFleetInfo(oldMember.voiceChannel.parent!)
    if (oldInfo && oldInfo.type === ChannelType.Ship) {
      const oldPlayer = getPlayerInfo(oldFleet, null, oldMember)
      dispatch(leftShip(oldFleet, oldInfo, oldPlayer))
    }
  }
  if (newMember && newMember.voiceChannel) {
    const newInfo = getChannelInfo(newMember.voiceChannel)
    const newFleet = getFleetInfo(newMember.voiceChannel.parent!)
    if (newInfo && newInfo.type === ChannelType.Ship) {
      const newPlayer = getPlayerInfo(newFleet, newInfo, newMember)
      dispatch(joinedShip(newFleet, newInfo, newPlayer))
    }
  }
}
