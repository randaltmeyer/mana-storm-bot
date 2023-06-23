import { GuildTextBasedChannel, Message, MessageCreateOptions, MessageEditOptions, PermissionFlagsBits } from "discord.js";
import { Payload, createPayload } from "./createPayload.mjs";
import { getBot } from "./getBot.mjs";
import { deleteMessages } from "./deleteMessages.mjs";

const activePostingMap = new Map<string, Promise<void>>();
export async function postSummaryToChannel(channel: GuildTextBasedChannel, payload?: Payload) {
	// we flat ignore non text based channels
	if (!channel?.isTextBased()) {
		console.warn(`Not a text-based channel: ${channel.id} (${channel?.name ?? "NO SUCH CHANNEL"})`);
		return;
	}

	// if we are actively posting to this channel, let's not double+ post
	const channelId = channel.id;
	if (activePostingMap.has(channelId)) {
		return activePostingMap.get(channelId);
	}

	// create the promise that that we can return
	const promise = new Promise<void>(async (resolve) => {
		setTimeout(async () => {
			const lastMessageId = await deleteMessages(channel);
			const lastMessage = lastMessageId ? await channel.messages.fetch(lastMessageId).catch(console.error) : null;
			if (lastMessage) {
				await editMessage(lastMessage, payload);
			}else {
				await postMessage(channel, payload);
			}
			resolve();
		}, 1000 * 2);
	});

	// set it to the map to be returned
	activePostingMap.set(channelId, promise);

	// await it to finish
	await promise;

	// remove it from the map
	activePostingMap.delete(channelId);
}

async function updateChannelTopic(guildChannel: GuildTextBasedChannel, playerCount: number) {
	const botMember = await guildChannel.guild.members.fetch(getBot().id);
	const perms = botMember.permissionsIn(guildChannel);
	if (perms.has(PermissionFlagsBits.ManageChannels)) {
		await guildChannel.edit({ topic:`https://manastorm.tinka.games/play (${playerCount} player(s) available)` });
	}
}

async function postMessage(guildChannel: GuildTextBasedChannel, payload?: Payload) {
	// ensure payload
	const sendPayload = payload ?? await createPayload();

	// update channel topic
	await updateChannelTopic(guildChannel, sendPayload.availablePlayers);

	// try to post message
	const botMember = await guildChannel.guild.members.fetch(getBot().id);
	const perms = botMember.permissionsIn(guildChannel);
	const perm = guildChannel.isThread() ? PermissionFlagsBits.SendMessagesInThreads : PermissionFlagsBits.SendMessages;
	if (perms.has(perm)) {
		const message = await guildChannel.send(sendPayload as MessageCreateOptions);
		getBot().setMessage(message);
	}
}

async function editMessage(guildMessage: Message, payload?: Payload) {
	// ensure payload
	const editPayload = payload ?? await createPayload();

	// update channel topic
	await updateChannelTopic(guildMessage.channel as GuildTextBasedChannel, editPayload.availablePlayers);

	// try to edit message
	await guildMessage.edit(editPayload as MessageEditOptions);
}