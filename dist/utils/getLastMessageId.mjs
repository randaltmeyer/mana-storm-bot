import { getChannels } from "./getChannels.mjs";
export function getLastMessageId(guildId, channelId) {
    const channels = getChannels();
    const channel = channels.find(ch => ch.guildId === guildId && ch.channelId === channelId);
    return channel?.messageId;
}
//# sourceMappingURL=getLastMessageId.mjs.map