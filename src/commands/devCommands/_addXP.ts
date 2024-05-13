import Command from '../../interfaces/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import errorEmbed from '../../embeds/errorEmbed';
import embedTemplate from '../../embeds/embedTemplate';
import addXp from '../../economy/addXp';
import latiString from '../../embeds/helpers/latiString';
import intReply from '../../utils/intReply';

const _addXP: Command = {
  description: 'Add EXP',
  color: 0xffffff,
  data: {
    name: 'addxp',
    description: 'Add EXP',
    options: [
      {
        name: 'user',
        description: 'User that shall receive the EXP',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'amount',
        description: 'Amount of EXP to add',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  async run(i) {
    const target = i.options.getUser('lietotājs')!;
    const xpToAdd = i.options.getInteger('daudzums')!;

    const leveledUser = await addXp(target.id, i.guildId!, xpToAdd);
    if (!leveledUser) return intReply(i, errorEmbed);

    const { user, levelIncrease, maxLevelReward } = leveledUser;

    intReply(
      i,
      embedTemplate({
        i,
        description:
          `<@${target.id}> tika pievienoti ${xpToAdd} UlmaņPunkti\n` +
          `Līmenis: ${user.level}, UlmaņPunkti: ${user.xp}\n` +
          (levelIncrease ? `Palielināts līmenis **${levelIncrease.from}** -> **${levelIncrease.to}**\n` : '') +
          (maxLevelReward ? `Maksimālā līmeņa bonuss: **${latiString(maxLevelReward)}**` : ''),
        color: this.color,
      })
    );
  },
};

export default _addXP;
