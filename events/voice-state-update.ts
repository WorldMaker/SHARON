import * as Discord from 'discord.js'
import { Dispatch } from 'redux'
import { Action, joinedShip, leftShip } from '../actions/index.ts'
import { getChannelInfo } from '../models/channel.ts'
import { getFleetInfo } from '../models/fleet.ts'
import { getPlayerInfo } from '../models/player.ts'
import { ChannelType } from '../models/index.ts'

export default function voiceStateUpdate(
  dispatch: Dispatch<Action>,
  oldMember: Discord.VoiceState,
  newMember: Discord.VoiceState,
) {
  if (oldMember && oldMember.channel) {
    const oldInfo = getChannelInfo(oldMember.channel)
    const oldFleet = getFleetInfo(oldMember.channel.parent!)
    if (oldInfo && oldInfo.type === ChannelType.Ship && oldMember.member) {
      const oldPlayer = getPlayerInfo(oldFleet, null, oldMember.member)
      dispatch(leftShip(oldFleet, oldInfo, oldPlayer))
    }
  }
  if (newMember && newMember.channel) {
    const newInfo = getChannelInfo(newMember.channel)
    const newFleet = getFleetInfo(newMember.channel.parent!)
    if (newInfo && newInfo.type === ChannelType.Ship && newMember.member) {
      const newPlayer = getPlayerInfo(newFleet, newInfo, newMember.member)
      dispatch(joinedShip(newFleet, newInfo, newPlayer))
    }
  }
}
