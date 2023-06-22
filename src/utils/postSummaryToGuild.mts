import { Guild } from "discord.js";
import { Payload } from "./createPayload.mjs";
import { getChannels } from "./getChannels.mjs";
import { postSummaryToChannel } from "./postSummaryToChannel.mjs";

export async function postSummaryToGuild(guild: Guild, payload?: Payload) {
	// get the channel data
	const channel = getChannels().find(ch => ch.guildId === guild.id);
	if (!channel) {
		console.warn(`No channel for guild: ${guild.id} (${guild.name})`);
		return;
	}

	// get the guild text-based channel
	const guildChannel = await guild.channels.fetch(channel.channelId).catch(console.error);
	if (!guildChannel?.isTextBased()) {
		console.warn(`Not a text-based channel: ${channel.channelId} (${guildChannel?.name ?? "NO SUCH CHANNEL"})`);
		return;
	}

	await postSummaryToChannel(guildChannel, channel.messageId, payload);
}
