import { getChannels } from "./getChannels.mjs";
import { getBot } from "./getBot.mjs";
import { getJson } from "./getJson.mjs";
export async function postSummary(guild) {
    const channel = getChannels().find(ch => ch.guildId === guild.id);
    if (!channel) {
        console.warn(`No channel for guild: ${guild.id} (${guild.name})`);
        return;
    }
    const guildChannel = await guild.channels.fetch(channel.channelId).catch(console.error);
    if (!guildChannel?.isTextBased()) {
        console.warn(`Not a text-based channel: ${channel.channelId} (${guildChannel?.name ?? "NO SUCH CHANNEL"})`);
        return;
    }
    const guildMessage = channel.messageId ? await guildChannel.messages.fetch(channel.messageId).catch(console.error) : null;
    if (!guildMessage) {
    }
}
async function getLiveMatchIds() {
    const liveMatches = await getJson(getBot().liveMatchListUrl);
    return liveMatches?.result ?? [];
}
async function getLiveMatch(id) {
    const liveMatch = await getJson(getBot().liveMatchUrl + id);
    if (liveMatch)
        console.log(JSON.stringify(liveMatch));
    return liveMatch;
}
async function getAvailablePlayerIds() {
    const availablePlayers = await getJson(getBot().availablePlayerListUrl);
    return availablePlayers?.result ?? [];
}
async function getAvailablePlayer(id) {
    const availablePlayer = await getJson(getBot().availablePlayerUrl + id);
    return availablePlayer;
}
export async function createPayload() {
    const liveMatches = [];
    const liveMatchIds = await getLiveMatchIds();
    for (const liveMatchId of liveMatchIds) {
        const liveMatch = await getLiveMatch(liveMatchId);
        if (liveMatch)
            liveMatches.push(liveMatch);
    }
    const availablePlayers = [];
    const availablePlayerIds = await getAvailablePlayerIds();
    for (const availablePlayerId of availablePlayerIds) {
        const availablePlayer = await getAvailablePlayer(availablePlayerId);
        if (availablePlayer)
            availablePlayers.push(availablePlayer);
    }
    const content = `There are currently:\n>**${liveMatchIds.length} Active Matches**\n>**${availablePlayerIds.length} Available Players**`;
    const embeds = [];
    return { content, embeds };
}
async function postMessage(channel) {
    channel;
}
postMessage;
async function editMessage(guildMessage) {
    guildMessage;
}
editMessage;
//# sourceMappingURL=postSummary.mjs.map