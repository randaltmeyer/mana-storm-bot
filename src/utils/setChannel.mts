import { GuildTextBasedChannel } from "discord.js";
import { getBot } from "./getBot.mjs";
import { postSummaryToGuild } from "./postSummaryToGuild.mjs";
import { deleteMessages } from "./deleteMessages.mjs";

export async function setChannel(guildChannel: GuildTextBasedChannel) {
	// out with the old ...
	await deleteMessages(guildChannel);

	// save channel for guild
	getBot().setChannel({ guildId:guildChannel.guildId, channelId:guildChannel.id, messageId:"" });

	// ... in with the new
	await postSummaryToGuild(guildChannel.guild);
}