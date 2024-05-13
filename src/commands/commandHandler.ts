import { commandList, devCommandList } from './commandList';
import { ChannelType, ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import errorEmbed from '../embeds/errorEmbed';
import interactionCache from '../utils/interactionCache';
import ephemeralReply from '../embeds/ephemeralReply';
import logCommand from '../utils/logCommand';
import findUser from '../economy/findUser';
import millisToReadableTime from '../embeds/helpers/millisToReadableTime';
import resetDailyCooldown from '../economy/resetDailyCooldown';
import smallEmbed from '../embeds/smallEmbed';
import intReply from '../utils/intReply';

export default async function commandHandler(i: ChatInputCommandInteraction) {
  if (!i.guild) {
    return intReply(i, 'Commands must be run in a server');
  }

  if (i.channel?.type !== ChannelType.GuildText) return;

  if (
    !i.guild.members.me!.permissionsIn(i.channelId).has(PermissionsBitField.Flags.UseExternalEmojis) ||
    !i.guild.roles.everyone.permissionsIn(i.channelId).has(PermissionsBitField.Flags.UseExternalEmojis)
  ) {
    return intReply(i, smallEmbed('EES requires the following permissions to run: **"Use External Emojis"**', 0xffffff));
  }

  const userId = i.user.id;
  const guildId = i.guildId!;

  let command = commandList.find(cmd => cmd.data.name === i.commandName);

  if (command) {
    // pārbauda iekš interaction cache vai komanda nav aktīva
    const cachedCommand = interactionCache.get(`${userId}-${guildId}`)?.get(command.data.name);
    if (cachedCommand?.isInteractionActive) {
      const { channelId, messageId } = cachedCommand.collector;
      return intReply(
        i,
        ephemeralReply(
          `This command is already **[active](https://discord.com/channels/${guildId}/${channelId}/${messageId})**`
        )
      );
    }

    const user = await findUser(userId, guildId);
    if (!user) return intReply(i, errorEmbed);

    if (command.cooldown) {
      const currentCooldown = user.timeCooldowns.find(c => c.name === command?.data.name);

      if (currentCooldown) {
        const timePassed = Date.now() - currentCooldown.lastUsed;
        if (timePassed < command.cooldown)
          return intReply(
            i,
            ephemeralReply(
              `Command **/${command.data.name}** will be available after\n` +
                `\`\`\`${millisToReadableTime(command.cooldown - timePassed)}\`\`\``
            )
          );
      }
    }

    const currentDay = new Date().toLocaleDateString('en-GB');
    if (user.lastDayUsed !== currentDay) await resetDailyCooldown(userId, guildId);

    command.run(i);
    logCommand(i);
    return;
  }

  // ja testa komandas KAUT KĀDĀ veidā nokļūst mirstīgu cilvēku rokās, šis neļaus tām strādāt
  if (userId !== process.env.DEV_ID) {
    return intReply(i, errorEmbed);
  }

  // komandas testēšanai, privātajam serverim
  command = devCommandList.find(cmd => cmd.data.name === i.commandName);
  if (command) command.run(i);
}
