import Command from '../../../interfaces/Command';
import { CommandInteraction, Message, MessageButtonStyle } from 'discord.js';
import itemList, { ItemCategory } from '../../../items/itemList';
import embedTemplate from '../../../embeds/embedTemplate';
import latiString from '../../../embeds/helpers/latiString';
import veikalsConfig from './veikalsConfig';
import commandColors from '../../../embeds/commandColors';
import itemString from '../../../embeds/helpers/itemString';
import buttonHandler from '../../../embeds/buttonHandler';
import veikalsComponents from './veikalsComponents';
import findUser from '../../../economy/findUser';
import pirktRun from '../pirkt/pirktRun';
import errorEmbed from '../../../embeds/errorEmbed';
import countFreeInvSlots from '../../../items/helpers/countFreeInvSlots';
import getItemPrice from '../../../items/helpers/getItemPrice';

export const veikals: Command = {
  title: 'Veikals',
  description: 'Atvērt veikalu',
  color: commandColors.veikals,
  config: veikalsConfig,
  async run(i: CommandInteraction) {

    const user = await findUser(i.user.id);
    if (!user) {
      await i.reply(errorEmbed);
      return;
    }

    const shopItems = Object.entries(itemList).filter(
      ([_, item]) => item.categories.includes(ItemCategory.VEIKALS),
    ).sort( // sakārto preces no dārgākajām uz lētākajām
      (a, b) => b[1].value - a[1].value,
    );

    const interactionReply = await i.reply(embedTemplate({
      i,
      title: 'Veikals',
      description: 'Nopirkt preci: `/pirkt <preces_id> <daudzums>`',
      color: this.color,
      fields: shopItems.map(([_, item]) => ({
        name: itemString(item),
        value:
          `Cena: ${latiString(item.value * 2)} | ` + // TODO: pievienot nocenojumu ja ir atlaide
          `id: \`${item.ids[0]}\``,
        inline: false,
      })),
      components: veikalsComponents(shopItems, user),
    }));

    let chosenItem = '';
    let chosenAmount = 1;

    await buttonHandler(i, 'veikals', interactionReply! as Message, async (componentInteraction) => {

      switch (componentInteraction.customId) {
        case 'veikals_prece':
          if (componentInteraction.componentType !== 'SELECT_MENU') return;
          chosenItem = componentInteraction.values[0];

          return {
            edit: {
              components: veikalsComponents(shopItems, user, chosenItem, chosenAmount),
            },
          };

        case 'veikals_daudzums':
          if (componentInteraction.componentType !== 'SELECT_MENU') return;
          chosenAmount = parseInt(componentInteraction.values[0]);

          return {
            edit: {
              components: veikalsComponents(shopItems, user, chosenItem, chosenAmount),
            },
          };

        case 'veikals_pirkt':
          if (componentInteraction.componentType !== 'BUTTON') return;

          let buttonStyle = 'SUCCESS';

          const userBeforeBuy = await findUser(i.user.id);
          if (userBeforeBuy) {
            const totalCost = getItemPrice(chosenItem) * chosenAmount;
            if (userBeforeBuy.lati < totalCost || countFreeInvSlots(userBeforeBuy) < chosenAmount) {
              buttonStyle = 'DANGER';
            }
          }

          return {
            end: true,
            edit: {
              components: veikalsComponents(
                shopItems, user, chosenItem, chosenAmount, buttonStyle as MessageButtonStyle,
              ),
            },
            after: async () => pirktRun(componentInteraction, chosenItem, chosenAmount, commandColors.pirkt),
          };

        default:
          return;
      }
    }, 60000);
  },
};

export default veikals;