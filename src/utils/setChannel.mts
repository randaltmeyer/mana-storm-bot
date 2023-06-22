import { GuildTextBasedChannel } from "discord.js";
import { writeFileSync } from "fs";
import { getBot } from "./getBot.mjs";
import { getChannels } from "./getChannels.mjs";
import { postSummaryToGuild } from "./postSummaryToGuild.mjs";

export async function setChannel(guildChannel: GuildTextBasedChannel) {
	const guildId = guildChannel.guildId;
	const channelId = guildChannel.id;
	const channels = getChannels();
	let channel = channels.find(channel => channel.guildId === guildId);
	if (channel?.messageId) {
		// remove old message
		if (guildChannel.isTextBased()) {
			const message = await guildChannel.messages.fetch(channel.messageId).catch(console.error);
			if (message) {
				try {
					if (message.deletable) {
						message.delete();
					}
				}catch(ex) {
					console.error(ex);
				}
			}
		}

		// update channel
		channel.channelId = channelId;
		channel.messageId = "";

	}else {
		// create channel
		channel = { guildId, channelId, messageId:"" };
		channels.push(channel);
	}

	// write new channels list
	writeFileSync(getBot().channelDataPath, JSON.stringify(channels), "utf8");

	// post to new channel
	await postSummaryToGuild(guildChannel.guild);
}