import { createPayload } from "./createPayload.mjs";
import { getBot } from "./getBot.mjs";
import { postSummaryToChannel } from "./postSummaryToChannel.mjs";
export async function postSummaryToClient(client) {
    const channels = getBot().channels;
    const payload = await createPayload();
    for (const channel of channels) {
        const guild = await client.guilds.fetch(channel.guildId).catch(console.error);
        if (guild) {
            const guildChannel = await guild.channels.fetch(channel.channelId).catch(console.error);
            if (guildChannel) {
                await postSummaryToChannel(guildChannel, payload);
            }
        }
    }
}
