import { ApplicationCommandOptionType } from 'discord.js';
import addLati from '../../economy/addLati';
import addTimeCooldown from '../../economy/addTimeCooldown';
import editItemAttribute from '../../economy/editItemAttribute';
import findUser from '../../economy/findUser';
import commandColors from '../../embeds/commandColors';
import embedTemplate from '../../embeds/embedTemplate';
import ephemeralReply from '../../embeds/ephemeralReply';
import errorEmbed from '../../embeds/errorEmbed';
import { displayAttributes } from '../../embeds/helpers/displayAttributes';
import itemString from '../../embeds/helpers/itemString';
import latiString from '../../embeds/helpers/latiString';
import iconEmojis from '../../embeds/iconEmojis';
import Command from '../../interfaces/Command';
import itemList from '../../items/itemList';
import { statusList } from './profils';

const ZAGT_MIN_LATI = 100;
const ZAGT_MAX_LATI = 1000;

const BASE_STEAL_CHANCE = 0.35;
const NAZIS_STEAL_CHANCE = 0.6;

const MIN_BANKA_STEAL = 800;
const MAX_BANKA_STEAL = 1500;

const zagt: Command = {
  title: 'Zagt',
  description: 'Apzagt kādu',
  color: commandColors.zagt,
  cooldown: 900_000, // 15 min
  data: {
    name: 'zagt',
    description: 'Apzagt kādu',
    options: [
      {
        name: 'lietotājs',
        description: 'Lietotājs kuru apzagt',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  async run(i) {
    const guildId = i.guildId!;

    const target = i.options.getUser('lietotājs');
    if (!target) return i.reply(ephemeralReply('Izvēlies no kā zagt'));

    if (target.id === i.user.id) {
      return i.reply(ephemeralReply('Tu nevari zagt no sevis'));
    }

    const [user, targetUser] = await Promise.all([findUser(i.user.id, guildId), findUser(target.id, guildId)]);
    if (!user || !targetUser) return i.reply(errorEmbed);

    const currentTime = Date.now();

    // zagt no valsts bankas
    if (target.id === i.client.user!.id) {
      if (targetUser.lati < MIN_BANKA_STEAL) {
        return i.reply(
          ephemeralReply(`Lai apzagtu Valsts banku, tai ir jābūt vismaz ${latiString(MIN_BANKA_STEAL, false, true)}`)
        );
      }

      const maiss = user.specialItems.find(item => item.name === 'naudas_maiss' && item.attributes.latiCollected === 0);
      if (!maiss) {
        return i.reply(
          ephemeralReply(`Lai apzagtu Valsts banku tev ir nepieciešams tukšs **${itemString(itemList.naudas_maiss)}**`)
        );
      }

      const maxSteal = targetUser.lati > MAX_BANKA_STEAL ? MAX_BANKA_STEAL : targetUser.lati;
      const stolenAmount = Math.floor(Math.random() * (maxSteal - MIN_BANKA_STEAL)) + MIN_BANKA_STEAL;

      const [userAfter, bankaUser] = await Promise.all([
        editItemAttribute(i.user.id, guildId, maiss._id!, { latiCollected: stolenAmount }),
        addLati(i.client.user!.id, guildId, -stolenAmount),
        addTimeCooldown(i.user.id, guildId, 'zagt'),
      ]);
      if (!userAfter || !bankaUser) return i.reply(errorEmbed);

      return i.reply(
        embedTemplate({
          i,
          color: this.color,
          title: `${iconEmojis.checkmark} Zagt no Valsts Bankas`,
          description:
            `No Valsts bankas tu nozagi ${latiString(stolenAmount, true, true)}\n\n` +
            `Tavam inventāram tika pievienots:\n` +
            `**${itemString(itemList.naudas_maiss)}** (${displayAttributes(userAfter.newItem)})`,
          fields: [
            {
              name: 'Valsts bankai palika',
              value: latiString(bankaUser.lati),
              inline: true,
            },
          ],
        })
      );
    }

    if (targetUser.status.aizsargats > currentTime) {
      return i.reply(ephemeralReply(`Tu nevari zagt kamēr ${target} ir **"${statusList.aizsargats}"** statuss`));
    }

    if (user.status.aizsargats > currentTime) {
      return i.reply(ephemeralReply(`Tu nevari zagt kamēr tev ir **"${statusList.aizsargats}"** statuss`));
    }

    if (user.lati < ZAGT_MIN_LATI) {
      return i.reply(
        ephemeralReply(
          `Tev vajag vismaz ${latiString(ZAGT_MIN_LATI, true, true)} lai zagtu no kāda\n` +
            `Tev ir ${latiString(user.lati)}`
        )
      );
    }

    if (targetUser.lati < ZAGT_MIN_LATI) {
      return i.reply(
        ephemeralReply(
          `${target} vajag vismaz ${latiString(ZAGT_MIN_LATI, true, true)} lai tu varētu no viņa zagt\n` +
            `Viņam ir ${latiString(targetUser.lati)}`
        )
      );
    }

    let maxSteal = user.lati > targetUser.lati ? targetUser.lati : user.lati;
    if (maxSteal > ZAGT_MAX_LATI) maxSteal = ZAGT_MAX_LATI;

    const stolenAmount = Math.floor(Math.random() * (maxSteal - ZAGT_MIN_LATI)) + ZAGT_MIN_LATI;

    const hasLaupitajs = user.status.laupitajs > currentTime;
    const stealChance = hasLaupitajs ? NAZIS_STEAL_CHANCE : BASE_STEAL_CHANCE;
    const didSteal = Math.random() < stealChance;

    const [userAfter, targetUserAfter] = await Promise.all([
      addLati(i.user.id, guildId, stolenAmount * (didSteal ? 1 : -1)),
      addLati(target.id, guildId, stolenAmount * (didSteal ? -1 : 1)),
      addTimeCooldown(i.user.id, guildId, 'zagt'),
    ]);
    if (!userAfter || !targetUserAfter) return i.reply(errorEmbed);

    const text = didSteal
      ? `Tev izdevās nozagt ${latiString(stolenAmount, true, true)} no ${target}`
      : `Zogot no ${target} tu pazaudēji ${latiString(stolenAmount, true, true)}`;

    i.reply(
      embedTemplate({
        i,
        color: this.color,
        content: `${target}`,
        title:
          `${didSteal ? iconEmojis.checkmark : iconEmojis.cross} Zagt ` +
          (hasLaupitajs ? `(ar "${statusList.laupitajs}" statusu)` : ''),
        description: text,
        fields: [
          {
            name: 'Tev tagad ir',
            value: latiString(userAfter.lati),
            inline: true,
          },
          {
            name: `${target.tag} tagad ir`,
            value: latiString(targetUserAfter.lati),
            inline: true,
          },
        ],
      })
    );
  },
};

export default zagt;