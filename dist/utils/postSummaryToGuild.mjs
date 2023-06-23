import { getBot } from "./getBot.mjs";
import { postSummaryToChannel } from "./postSummaryToChannel.mjs";
export async function postSummaryToGuild(guild, payload) {
    const channel = getBot().findChannel(guild.id);
    if (!channel) {
        console.warn(`No channel for guild: ${guild.id} (${guild.name})`);
        return;
    }
    const guildChannel = await guild.channels.fetch(channel.channelId).catch(console.error);
    if (!guildChannel?.isTextBased()) {
        console.warn(`Not a text-based channel: ${channel.channelId} (${guildChannel?.name ?? "NO SUCH CHANNEL"})`);
        return;
    }
    await postSummaryToChannel(guildChannel, payload);
}
//# sourceMappingURL=postSummaryToGuild.mjs.map