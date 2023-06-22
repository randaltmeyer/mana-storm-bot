import { writeFileSync } from "fs";
import { getBot } from "./getBot.mjs";
import { getChannels } from "./getChannels.mjs";
export function setMessageId(message) {
    const channels = getChannels();
    const channel = channels.find(ch => ch.guildId === message.guildId && ch.channelId === message.channelId);
    if (channel) {
        channel.messageId = message.id;
        writeFileSync(getBot().channelDataPath, JSON.stringify(channels), "utf8");
    }
}
//# sourceMappingURL=setMessageId.mjs.map