import { writeFileSync } from "fs";
import { getBot } from "./getBot.mjs";
import { getChannels } from "./getChannels.mjs";
import { postSummaryToGuild } from "./postSummaryToGuild.mjs";
export async function setChannel(guildChannel) {
    const guildId = guildChannel.guildId;
    const channelId = guildChannel.id;
    const channels = getChannels();
    let channel = channels.find(channel => channel.guildId === guildId);
    if (channel?.messageId) {
        if (guildChannel.isTextBased()) {
            const message = await guildChannel.messages.fetch(channel.messageId).catch(console.error);
            if (message) {
                try {
                    if (message.deletable) {
                        message.delete();
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }
        channel.channelId = channelId;
        channel.messageId = "";
    }
    else {
        channel = { guildId, channelId, messageId: "" };
        channels.push(channel);
    }
    writeFileSync(getBot().channelDataPath, JSON.stringify(channels), "utf8");
    await postSummaryToGuild(guildChannel.guild);
}
//# sourceMappingURL=setChannel.mjs.map