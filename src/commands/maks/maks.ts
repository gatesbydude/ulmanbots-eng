import Command from '../../interfaces/Command'
import { ApplicationCommandData, CommandInteraction } from 'discord.js'
import findUser from '../../economy/findUser'
import embedTemplate from '../../embeds/embedTemplate'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import errorEmbed from '../../embeds/errorEmbed'
import latiString from '../../utils/latiString'
import userString from '../../utils/userString'

export const maks: Command = {
  title: 'Maks',
  description: 'Apskatīties savu vai kāda lietotāja maku',
  config: {
    name: 'maks',
    description: 'Apskatīties maku',
    options: [
      {
        name: 'lietotājs',
        description: 'Lietotājs kam vēlies apskatīt maku',
        type: ApplicationCommandOptionTypes.USER,
      },
    ],
  } as ApplicationCommandData,
  async run(i: CommandInteraction) {
    let target = i.user

    if (i.options.data[0]?.user) {
      target = i.options.data[0].user
    }

    const user = await findUser(i.guildId!, target.id)
    if (!user) {
      await i.reply(errorEmbed)
      return
    }

    let targetText = 'Tev'
    if (target.id === process.env.BOT_ID) targetText = 'Valsts bankai'
    else if (target.id !== i.user.id) targetText = `${userString(target, true)}`

    await i.reply(embedTemplate({
      i,
      description: `${targetText} ir ${latiString(user.lati)}`,
    }))
  },
}