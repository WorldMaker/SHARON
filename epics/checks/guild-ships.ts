import { ofType, StateObservable } from 'redux-observable'
import { DiscordDependency } from '../model.ts'
import { Store } from '../../models/store/index.ts'
import {
  filter,
  from,
  merge,
  mergeMap,
  Observable,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs'
import { Action, ActionType } from '../../actions/index.ts'
import { CategoryChannel, ChannelType } from 'discord.js'
import nlp from 'compromise'
import {
  getGuildShipChannelName,
  getGuildShipInfo,
  GuildShipInfo,
  RareGuildShip,
  RareGuildShipsResponse,
} from '../../models/guild-ship.ts'
import {
  createdGuildShip,
  removedGuildShip,
  updatedGuildShip,
} from '../../actions/guild-ship.ts'

const DataPath = '_data'
const GuildShipsFilename = 'guild-ships.json'

interface NoGuildShips {
  type: 'none'
}

interface ExistingShip {
  ship: GuildShipInfo
  rareShip: RareGuildShip
}

interface CheckGuildShips {
  type: 'check'
  guildId: string
  fleetId: string
  newShips: RareGuildShip[]
  existingShips: ExistingShip[]
  removedShips: GuildShipInfo[]
}

function isCheck(
  item: NoGuildShips | CheckGuildShips,
): item is CheckGuildShips {
  return item.type === 'check'
}

export function checkGuildShipsEpic(
  action: Observable<Action>,
  state: StateObservable<Store>,
  { client }: DiscordDependency,
) {
  const checkGuildShips = action.pipe(
    ofType(ActionType.CheckGuild),
    withLatestFrom(state),
    switchMap(
      async ([action, state]): Promise<NoGuildShips | CheckGuildShips> => {
        const guildId = action.guildId
        const fleet = client.guilds.resolve(guildId)?.channels.valueOf().find(
          (c) =>
            c instanceof CategoryChannel &&
            nlp(c.name).match('guild ships'),
        )
        if (!fleet) {
          return { type: 'none' }
        }
        let rareShips: RareGuildShipsResponse | null = null
        try {
          const rareShipsFile = await Deno.readTextFile(
            `${DataPath}/${guildId}/${GuildShipsFilename}`,
          )
          rareShips = JSON.parse(rareShipsFile)
        } catch (error) {
          console.warn(
            `Error reading rare ships file for [Discord] guild ${guildId}:`,
            error,
          )
          return { type: 'none' }
        }
        const ships = state.guilds[guildId]?.guildShips || {}
        const encountered = new Set<string>()
        const newShips: RareGuildShip[] = []
        const existingShips: ExistingShip[] = []
        for (const ship of rareShips?.Ships ?? []) {
          encountered.add(ship.Id)
          if (!ships[ship.Id]) {
            newShips.push(ship)
          } else {
            existingShips.push({ ship: ships[ship.Id].info, rareShip: ship })
          }
        }
        const removedShips = Object.keys(ships).filter((id) =>
          !encountered.has(id)
        ).map((id) => ships[id].info)
        return {
          type: 'check',
          guildId,
          fleetId: fleet.id,
          newShips,
          existingShips,
          removedShips,
        }
      },
    ),
    shareReplay(1),
  )

  const createdShips = checkGuildShips.pipe(
    filter(isCheck),
    switchMap(({ guildId, fleetId, newShips }) =>
      from(newShips!.map((rareShip) => ({ guildId, fleetId, rareShip })))
    ),
    mergeMap(async ({ guildId, fleetId, rareShip }) => {
      const guild = client.guilds.resolve(guildId)!
      const rareShipInfo = getGuildShipInfo(guildId, fleetId, '', rareShip)
      const channel = await guild.channels.create({
        name: getGuildShipChannelName(rareShipInfo),
        type: ChannelType.GuildVoice,
        parent: fleetId,
      })
      return createdGuildShip(
        getGuildShipInfo(guildId, fleetId, channel.id, rareShip),
      )
    }),
  )

  const updatedShips = checkGuildShips.pipe(
    filter(isCheck),
    switchMap(({ guildId, fleetId, existingShips }) =>
      from(
        existingShips!.map(({ ship, rareShip }) => ({
          guildId,
          fleetId,
          ship,
          rareShip,
        })),
      )
    ),
    mergeMap(async ({ guildId, fleetId, ship, rareShip }) => {
      const rareShipInfo = getGuildShipInfo(guildId, fleetId, ship.id, rareShip)
      if (
        ship.name !== rareShipInfo.name ||
        ship.shipType !== rareShipInfo.shipType
      ) {
        const guild = client.guilds.resolve(guildId)!
        const channel = guild.channels.resolve(ship.id)
        await channel?.setName(getGuildShipChannelName(rareShipInfo))
      }
      return updatedGuildShip(rareShipInfo)
    }),
  )

  const removedShips = checkGuildShips.pipe(
    filter(isCheck),
    switchMap(({ guildId, removedShips }) =>
      from(removedShips!.map((ship) => ({ guildId, ship })))
    ),
    mergeMap(async ({ guildId, ship }) => {
      const guild = client.guilds.resolve(guildId)!
      const channel = guild.channels.resolve(ship.id)
      await channel?.delete()
      return removedGuildShip(guildId, ship.rareId)
    }),
  )

  return merge(createdShips, updatedShips, removedShips)
}
