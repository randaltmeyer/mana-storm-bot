import { PermissionFlagsBits, userMention } from "discord.js";
import { postSummaryToChannel } from "../utils/postSummaryToChannel.mjs";
import { setChannel } from "../utils/setChannel.mjs";
import { canRespond } from "./canRespond.mjs";
import { getBot } from "../utils/getBot.mjs";
export async function handleMessageCreate(message) {
    if (!message.guild) {
        return;
    }
    try {
        if (canRespond(message)) {
            const perms = message.member?.permissions;
            const isAdmin = perms?.has(PermissionFlagsBits.Administrator);
            const isManager = perms?.has(PermissionFlagsBits.ManageGuild);
            if (isAdmin || isManager) {
                await setChannel(message.channel);
            }
        }
        else if (!getBot().isMyMessage(message)) {
            const channel = getBot().findChannel(message.channelId);
            if (channel) {
                await postSummaryToChannel(message.channel);
            }
        }
    }
    catch (ex) {
        console.error(ex);
        console.debug(`messageCreate: User(${message.member?.user.username}), Guild(${message.guild?.name})`);
        message.reply(`Hello ${userMention(message.author.id)}, something went wrong!`);
    }
}
