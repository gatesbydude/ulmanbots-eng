import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CommandInteraction,
  ComponentType,
  InteractionUpdateOptions,
  Message,
  MessagePayload,
  SelectMenuBuilder,
  SelectMenuInteraction,
} from 'discord.js';
import interactionCache, { InteractionInCache } from '../utils/interactionCache';

export interface CallbackReturn {
  edit?: InteractionUpdateOptions | MessagePayload;
  end?: boolean;
  after?: () => Promise<void>;
  setInactive?: boolean;
  doNothing?: boolean;
}

export default async function buttonHandler(
  interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction,
  interactionName: string,
  interactionMsg: Message,
  callback: (
    buttonInteraction: ButtonInteraction | SelectMenuInteraction
  ) => Promise<CallbackReturn | void>,
  time = 15000,
  isActive = false
): Promise<void> {
  const collector = interactionMsg.createMessageComponentCollector({ time });
  let currentMessage = interactionMsg;
  const userId = interaction.user.id;

  // pārbauda vai lietotājs ir interactionCache objektā, ja nav tad tiek pievienots kā {}
  if (!interactionCache.get(userId)) {
    interactionCache.set(userId, new Map<string, InteractionInCache>());
  }

  // ja interaction ar eksistējošu nosaukumu eksistē tad tā tiek apstādināta
  if (interactionCache.get(userId)?.get(interactionName)) {
    interactionCache.get(userId)?.get(interactionName)?.collector.stop();
  }

  // pievieno interactionCache objektam pašreizējo interaction
  interactionCache.get(userId)!.set(interactionName, {
    collector,
    isInteractionActive: isActive,
  });

  collector.on('collect', async (componentInteraction) => {
    if (componentInteraction.user.id !== interaction.user.id) {
      await componentInteraction.reply({
        content: 'Šī poga nav domāta tev',
        ephemeral: true,
      });
      return;
    }

    collector.resetTimer();

    const res = await callback(componentInteraction as ButtonInteraction | SelectMenuInteraction);
    if (!res) {
      await componentInteraction.deferUpdate().catch((_) => _);
      return;
    }

    if (res?.doNothing) return;

    if (res?.setInactive) {
      const userInteraction = interactionCache.get(userId)!.get(interactionName)!;
      interactionCache
        .get(userId)!
        .set(interactionName, { ...userInteraction, isInteractionActive: false });
    }

    // neliela šizofrēnija
    if (res?.edit) {
      if (res?.after) {
        currentMessage = await interaction.editReply(res.edit as MessagePayload);
      } else {
        currentMessage = await componentInteraction.update({
          ...(res.edit as InteractionUpdateOptions),
          fetchReply: true,
        });
      }
    }

    if (res?.end) {
      collector.stop();
    }

    await res.after?.();
  });

  collector.on('end', async () => {
    // izdzēš izbeigto interaction no interactionCache
    interactionCache.get(userId)?.delete(interactionName);

    // pārbauda ziņai ir pogas
    if (!currentMessage?.components || !currentMessage.components.length) return;

    let areAllComponentsAlreadyDisabled = true;

    const editedMessageComponents: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] = [];

    // iziet cauri visām pogām message objektā un atspējo tās
    currentMessage.components.forEach((row) => {
      const editedRow = new ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>();
      row.components.forEach((component) => {
        if (!component.data.disabled) areAllComponentsAlreadyDisabled = false;

        if (component.type === ComponentType.Button) {
          editedRow.addComponents(ButtonBuilder.from(component).setDisabled(true));
        } else if (component.type === ComponentType.SelectMenu) {
          editedRow.addComponents(SelectMenuBuilder.from(component).setDisabled(true));
        }
      });
      editedMessageComponents.push(editedRow);
    });

    // rediģē ziņu ar atspējotajām pogām, ja tās jau nav atspējotas
    if (!areAllComponentsAlreadyDisabled) {
      await interaction.editReply({ components: editedMessageComponents }).catch(console.log);
    }
  });
}
