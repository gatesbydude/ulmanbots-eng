import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType } from 'discord.js';
import deleteAuction from '../../../economy/auction/deleteAuction';
import findAuctionById from '../../../economy/auction/findAuctionById';
import buttonHandler from '../../../embeds/buttonHandler';
import embedTemplate from '../../../embeds/embedTemplate';
import ephemeralReply from '../../../embeds/ephemeralReply';
import errorEmbed from '../../../embeds/errorEmbed';
import intReply from '../../../utils/intReply';
import { izsoleItemString } from './izsoleEmbeds';

const deleteConfirmComponents = [
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('izsole_delete_yes').setLabel('Yes').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('izsole_delete_no').setLabel('No').setStyle(ButtonStyle.Danger)
  ),
];

export default async function izsolesDelete(i: ChatInputCommandInteraction) {
  const id = i.options.getString('id');
  if (!id) return intReply(i, errorEmbed);

  const izsole = await findAuctionById(id);
  if (!izsole) return intReply(i, ephemeralReply(`Auction with the id \`${id}\` was not found`));

  const msg = await intReply(
    i,
    embedTemplate({
      i,
      title: '❔ Are you sure you want to delete thid auction?',
      description: izsoleItemString(izsole),
      components: deleteConfirmComponents,
    })
  );
  if (!msg) return;

  buttonHandler(i, 'izsole', msg, async int => {
    const { customId } = int;
    if (int.componentType !== ComponentType.Button) return;

    switch (customId) {
      case 'izsole_delete_yes': {
        const res = await deleteAuction(id);
        if (!res) return { error: true };

        return {
          end: true,
          edit: {
            embeds: embedTemplate({
              i,
              title: '🔴 Auction deleted!',
              color: 0xee0000,
              description: izsoleItemString(izsole),
            }).embeds,
            components: [],
          },
        };
      }
      case 'izsole_delete_no': {
        return {
          end: true,
          edit: {
            components: [],
          },
        };
      }
    }
  });
}
