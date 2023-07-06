import { Interaction, Message } from "discord.js";
import { Bot } from "../utils/getBot.mjs";

export function canRespond(messageOrInteraction: Message | Interaction): boolean {
	if (messageOrInteraction.member?.user.bot) {
		return false;
	}
	const bot = Bot.instance;
	if (Bot.isDevMode) {
		if (messageOrInteraction.guildId !== bot.playgroundId) {
			return false;
		}
	}
	if ("mentions" in messageOrInteraction) {
		const mentions = messageOrInteraction.mentions;
		return !mentions.everyone && mentions.has(bot.id);
	}
	return false;
}