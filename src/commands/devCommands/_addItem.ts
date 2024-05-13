import Command from '../../interfaces/Command';
import { ApplicationCommandOptionType } from 'discord.js';
import embedTemplate from '../../embeds/embedTemplate';
import itemString from '../../embeds/helpers/itemString';
import addItem from '../../economy/addItems';
import wrongKeyEmbed from '../../embeds/wrongKeyEmbed';
import itemList from '../../items/itemList';
import intReply from '../../utils/intReply';
import allItemAutocomplete from '../economyCommands/info/allItemAutocomplete';

const _addItem: Command = {
  description: 'Add an item in an inventory',
  color: 0xffffff,
  data: {
    name: 'additem',
    description: 'Add an item in an inventory',
    options: [
      {
        name: 'targetusr',
        description: 'User that shall receive the item',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'name',
        description: 'The name of the item to add',
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
        required: true,
      },
      {
        name: 'amount',
        description: 'The amount of items to add (INTEGERS ONLY)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  autocomplete: allItemAutocomplete('⛔'),
  async run(i) {
    const target = i.options.getUser('targetusr')!;
    const itemToAddKey = i.options.getString('name')!;
    const amountToAdd = i.options.getInteger('amount')!;

    const itemToAdd = itemList[itemToAddKey];
    if (!itemToAdd) {
      return intReply(i, wrongKeyEmbed);
    }

    await addItem(target.id, i.guildId!, { [itemToAddKey]: amountToAdd });

    intReply(
      i,
      embedTemplate({
        i,
        description: `You added <@${target.id}> ${itemString(itemToAdd, amountToAdd, true)}`,
        color: this.color,
      })
    );
  },
};

export default _addItem;
