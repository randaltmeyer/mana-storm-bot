import { Message } from "discord.js";
import { writeFileSync } from "fs";
import { getBot } from "./getBot.mjs";
import { getChannels } from "./getChannels.mjs";

export function setMessageId(message: Message) {
	const channels = getChannels();
	const channel = channels.find(ch => ch.guildId === message.guildId && ch.channelId === message.channelId);
	if (channel) {
		channel.messageId = message.id;

		// write new channels list
		writeFileSync(getBot().channelDataPath, JSON.stringify(channels), "utf8");
	}
}