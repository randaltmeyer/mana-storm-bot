import { GuildTextBasedChannel } from "discord.js";
import { Bot } from "./getBot.mjs";

export async function deleteMessages(guildChannel: GuildTextBasedChannel): Promise<string | undefined> {
	const bot = Bot.instance;
	let lastMessageId: string | undefined;

	// collect past messages
	const messageCollection = await guildChannel.messages.fetch({ limit:10 });
	// iterate them
	const messages = messageCollection.values();
	for (const message of messages) {
		// only check mine
		if (bot.isMyMessage(message)) {
			// track if it is the last one in the channel
			const isLastMessage = message.id === guildChannel.lastMessageId;
			if (isLastMessage) {
				lastMessageId = message.id;

			// delete the rest
			}else if (message.deletable) {
				await message.delete();
			}
		}
	}

	return lastMessageId;
}