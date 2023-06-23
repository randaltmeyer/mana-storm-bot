import { GuildTextBasedChannel, Message, PermissionFlagsBits, userMention } from "discord.js";
import { postSummaryToChannel } from "../utils/postSummaryToChannel.mjs";
import { setChannel } from "../utils/setChannel.mjs";
import { canRespond } from "./canRespond.mjs";
import { getBot } from "../utils/getBot.mjs";

export async function handleMessageCreate(message: Message): Promise<void> {
	if (!message.guild) {
		return;
	}
	try {
		// respond to an admin/manager and configure the bot
		if (canRespond(message)) {
			const perms = message.member?.permissions;
			const isAdmin = perms?.has(PermissionFlagsBits.Administrator);
			const isManager = perms?.has(PermissionFlagsBits.ManageGuild);
			if (isAdmin || isManager) {
				await setChannel(message.channel as GuildTextBasedChannel)
			}
		
		// repost the message to keep it as the last in the channel ... as long as it isn't my post
		}else if (!getBot().isMyMessage(message)) {
			const channel = getBot().findChannel(message.channelId);
			if (channel) {
				await postSummaryToChannel(message.channel as GuildTextBasedChannel);
			}
		}

	}catch(ex) {
		console.error(ex);
		console.debug(`messageCreate: User(${message.member?.user.username}), Guild(${message.guild?.name})`);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong!`);
	}
}