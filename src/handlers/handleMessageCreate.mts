import { GuildTextBasedChannel, Message, PermissionFlagsBits, userMention } from "discord.js";
import { getChannels } from "../utils/getChannels.mjs";
import { postSummaryToChannel } from "../utils/postSummaryToChannel.mjs";
import { setChannel } from "../utils/setChannel.mjs";
import { canRespond } from "./canRespond.mjs";
import { getBot } from "../utils/getBot.mjs";

export async function handleMessageCreate(message: Message): Promise<void> {
	if (!message.guild) {
		return;
	}
	try {
		if (canRespond(message)) {
			const perms = message.member?.permissions;
			const isAdmin = perms?.has(PermissionFlagsBits.Administrator);
			const isManager = perms?.has(PermissionFlagsBits.ManageGuild);
			if (isAdmin || isManager) {
				await setChannel(message.channel as GuildTextBasedChannel)
			}
		}else if (message.author.id !== getBot().id) {
			const channel = getChannels().find(ch => ch.channelId === message.channelId);
			if (channel) {
				await postSummaryToChannel(message.channel as GuildTextBasedChannel, channel.messageId);
			}
		}
	}catch(ex) {
		console.error(ex);
		console.debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		console.debug(name);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong!`);
	}
}