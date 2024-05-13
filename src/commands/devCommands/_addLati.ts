import Command from '../../interfaces/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import embedTemplate from '../../embeds/embedTemplate';
import latiString from '../../embeds/helpers/latiString';
import findUser from '../../economy/findUser';
import errorEmbed from '../../embeds/errorEmbed';
import addLati from '../../economy/addLati';
import intReply from '../../utils/intReply';

const _addLati: Command = {
  description: 'Add euros',
  color: 0xffffff,
  data: {
    name: 'addeuros',
    description: 'Add euros',
    options: [
      {
        name: 'user',
        description: 'User that shall receive the money',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'amount',
        description: 'The amount of euros to hand out',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  async run(i) {
    const target = i.options.getUser('user')!;
    const latiToAdd = i.options.getInteger('amount')!;

    const targetUser = await findUser(target.id, i.guildId!);
    if (!targetUser) {
      return intReply(i, errorEmbed);
    }

    await addLati(target.id, i.guildId!, latiToAdd);

    intReply(
      i,
      embedTemplate({
        i,
        description:
          `<@${target.id}> tika pievienoti ${latiString(latiToAdd)}\n` +
          `Tagad viņam ir ${latiString(targetUser.lati + latiToAdd)}`,
        color: this.color,
      })
    );
  },
};

export default _addLati;
