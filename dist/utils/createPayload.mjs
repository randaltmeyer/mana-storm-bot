import { EmbedBuilder } from "discord.js";
import { getBot } from "./getBot.mjs";
import { getJson } from "./HttpUtils.mjs";
async function getAvailablePlayerIds() {
    const availablePlayers = await getJson(getBot().availablePlayerListUrl);
    return availablePlayers?.result ?? [];
}
async function getLiveMatchIds() {
    const liveMatches = await getJson(getBot().liveMatchListUrl);
    return liveMatches?.result ?? [];
}
async function getMatch(id) {
    const url = `${getBot().matchUrl}"${id}"`;
    const liveMatch = await getJson(url);
    const oneId = liveMatch?.result[0];
    const one = oneId ? await getPlayer(oneId) : null;
    const twoId = liveMatch?.result[1];
    const two = twoId ? await getPlayer(twoId) : null;
    return one && two ? { id, players: [one, two] } : null;
}
const playerCache = new Map();
async function getPlayer(id) {
    if (!playerCache.has(id)) {
        const url = `${getBot().playerUrl}"${id}"`;
        const availablePlayer = await getJson(url);
        const name = availablePlayer?.result.name;
        if (name) {
            playerCache.set(id, { id, name });
        }
    }
    return playerCache.get(id) ?? null;
}
export async function createPayload() {
    const matches = [];
    const liveMatchIds = await getLiveMatchIds();
    for (const matchId of liveMatchIds) {
        const match = await getMatch(matchId);
        if (match)
            matches.push(match);
    }
    const matchesOutput = matches
        .map(match => `> ${match.players[0].name} vs ${match.players[1].name}`)
        .join("\n")
        .replace(/@/g, "@\\");
    const players = [];
    const availablePlayerIds = await getAvailablePlayerIds();
    for (const playerId of availablePlayerIds) {
        const player = await getPlayer(playerId);
        if (player)
            players.push(player);
    }
    const playersOutput = players
        .map(player => `> ${player.name}`)
        .join("\n")
        .replace(/@/g, "@\\");
    const embed = new EmbedBuilder();
    embed.setTitle("Mana Storm (Beta) Activity Summary");
    embed.setDescription(`Play here: <https://manastorm.tinka.games/play>\nChat here: <https://discord.gg/ewar6KvsEU>`);
    embed.addFields({ name: `**Available Players: ${availablePlayerIds.length}**`, value: playersOutput || `> *None*` }, { name: `**Active Matches: ${liveMatchIds.length}**`, value: matchesOutput || `> *None*` });
    const embeds = [embed];
    return { content: ``, embeds, availablePlayers: availablePlayerIds.length };
}
//# sourceMappingURL=createPayload.mjs.map