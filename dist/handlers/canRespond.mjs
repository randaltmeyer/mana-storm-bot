import { Bot } from "../utils/getBot.mjs";
export function canRespond(messageOrInteraction) {
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
        return messageOrInteraction.mentions.has(bot.id);
    }
    return false;
}
//# sourceMappingURL=canRespond.mjs.map