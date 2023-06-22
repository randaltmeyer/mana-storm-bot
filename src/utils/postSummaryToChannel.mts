import { GuildTextBasedChannel, Message, MessageCreateOptions, MessageEditOptions, PermissionFlagsBits } from "discord.js";
import { Payload, createPayload } from "./createPayload.mjs";
import { setMessageId } from "./setMessageId.mjs";
import { getBot } from "./getBot.mjs";

export async function postSummaryToChannel(guildChannel: GuildTextBasedChannel, messageId: string, payload?: Payload) {
	if (!guildChannel?.isTextBased()) {
		console.warn(`Not a text-based channel: ${guildChannel.id} (${guildChannel?.name ?? "NO SUCH CHANNEL"})`);
		return;
	}

	const guildMessage = messageId ? await guildChannel.messages.fetch(messageId).catch(console.error) : null;

	// if no existing message, post a new one
	if (!guildMessage) {
		await postMessage(guildChannel, payload);
		return;
	}

	// if the message isn't the last, let's delete it and post a new one
	if (guildMessage.id !== guildChannel.lastMessageId) {
		if (guildMessage.deletable) {
			await guildMessage.delete();
		}
		await postMessage(guildChannel, payload);
		return;
	}

	await editMessage(guildMessage, payload);
}

async function updateChannelTopic(guildChannel: GuildTextBasedChannel, playerCount: number) {
	const botMember = await guildChannel.guild.members.fetch(getBot().id);
	const perms = botMember.permissionsIn(guildChannel);
	if (perms.has(PermissionFlagsBits.ManageChannels)) {
		await guildChannel.edit({ topic:`https://manastorm.tinka.games/play (${playerCount} player(s) available)` });
	}
}

async function postMessage(guildChannel: GuildTextBasedChannel, payload?: Payload) {
	const sendPayload = payload ?? await createPayload();
	const message = await guildChannel.send(sendPayload as MessageCreateOptions);
	setMessageId(message);
	await updateChannelTopic(guildChannel, sendPayload.availablePlayers);
}

async function editMessage(guildMessage: Message, payload?: Payload) {
	const editPayload = payload ?? await createPayload();
	await guildMessage.edit(editPayload as MessageEditOptions);
	await updateChannelTopic(guildMessage.channel as GuildTextBasedChannel, editPayload.availablePlayers);
}