import { PermissionFlagsBits } from "discord.js";
import { createPayload } from "./createPayload.mjs";
import { setMessageId } from "./setMessageId.mjs";
import { getBot } from "./getBot.mjs";
export async function postSummaryToChannel(guildChannel, messageId, payload) {
    if (!guildChannel?.isTextBased()) {
        console.warn(`Not a text-based channel: ${guildChannel.id} (${guildChannel?.name ?? "NO SUCH CHANNEL"})`);
        return;
    }
    const guildMessage = messageId ? await guildChannel.messages.fetch(messageId).catch(console.error) : null;
    if (!guildMessage) {
        await postMessage(guildChannel, payload);
        return;
    }
    if (guildMessage.id !== guildChannel.lastMessageId) {
        if (guildMessage.deletable) {
            await guildMessage.delete();
        }
        await postMessage(guildChannel, payload);
        return;
    }
    await editMessage(guildMessage, payload);
}
async function updateChannelTopic(guildChannel, playerCount) {
    const botMember = await guildChannel.guild.members.fetch(getBot().id);
    const perms = botMember.permissionsIn(guildChannel);
    if (perms.has(PermissionFlagsBits.ManageChannels)) {
        await guildChannel.edit({ topic: `https://manastorm.tinka.games/play (${playerCount} player(s) available)` });
    }
}
async function postMessage(guildChannel, payload) {
    const sendPayload = payload ?? await createPayload();
    const message = await guildChannel.send(sendPayload);
    setMessageId(message);
    await updateChannelTopic(guildChannel, sendPayload.availablePlayers);
}
async function editMessage(guildMessage, payload) {
    const editPayload = payload ?? await createPayload();
    await guildMessage.edit(editPayload);
    await updateChannelTopic(guildMessage.channel, editPayload.availablePlayers);
}
//# sourceMappingURL=postSummaryToChannel.mjs.map