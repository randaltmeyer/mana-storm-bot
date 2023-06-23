import { PermissionFlagsBits } from "discord.js";
import { createPayload } from "./createPayload.mjs";
import { getBot } from "./getBot.mjs";
import { deleteMessages } from "./deleteMessages.mjs";
const activePostingMap = new Map();
export async function postSummaryToChannel(channel, payload) {
    if (!channel?.isTextBased()) {
        console.warn(`Not a text-based channel: ${channel.id} (${channel?.name ?? "NO SUCH CHANNEL"})`);
        return;
    }
    const channelId = channel.id;
    if (activePostingMap.has(channelId)) {
        return activePostingMap.get(channelId);
    }
    const promise = new Promise(async (resolve) => {
        setTimeout(async () => {
            const lastMessageId = await deleteMessages(channel);
            const lastMessage = lastMessageId ? await channel.messages.fetch(lastMessageId).catch(console.error) : null;
            if (lastMessage) {
                await editMessage(lastMessage, payload);
            }
            else {
                await postMessage(channel, payload);
            }
            resolve();
        }, 1000 * 2);
    });
    activePostingMap.set(channelId, promise);
    await promise;
    activePostingMap.delete(channelId);
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
    await updateChannelTopic(guildChannel, sendPayload.availablePlayers);
    const botMember = await guildChannel.guild.members.fetch(getBot().id);
    const perms = botMember.permissionsIn(guildChannel);
    const perm = guildChannel.isThread() ? PermissionFlagsBits.SendMessagesInThreads : PermissionFlagsBits.SendMessages;
    if (perms.has(perm)) {
        const message = await guildChannel.send(sendPayload);
        getBot().setMessage(message);
    }
}
async function editMessage(guildMessage, payload) {
    const editPayload = payload ?? await createPayload();
    await updateChannelTopic(guildMessage.channel, editPayload.availablePlayers);
    await guildMessage.edit(editPayload);
}
