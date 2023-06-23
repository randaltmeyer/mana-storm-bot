import { EmbedBuilder, MessageCreateOptions, MessageEditOptions } from "discord.js";
import { getBot } from "./getBot.mjs";
import { getJson } from "./HttpUtils.mjs";

type ListResult = { result:string[]; }
type AvailablePlayerResult = { result:{ name:string; } }
type LiveMatchResult = { result:[string, string]; }
type Player = { id:string; name:string; }
type Match = { id:string; players:Player[]; }

async function getAvailablePlayerIds(): Promise<string[]> {
	const availablePlayers = await getJson<ListResult>(getBot().availablePlayerListUrl);
	return availablePlayers?.result ?? [];
}

async function getLiveMatchIds(): Promise<string[]> {
	const liveMatches = await getJson<ListResult>(getBot().liveMatchListUrl);
	return liveMatches?.result ?? [];
}

async function getMatch(id: string): Promise<Match | null> {
	const url = `${getBot().matchUrl}"${id}"`;
	const liveMatch = await getJson<LiveMatchResult>(url);
	// if (liveMatch) console.log(JSON.stringify(liveMatch));
	const oneId = liveMatch?.result[0];
	const one = oneId ? await getPlayer(oneId) : null;
	const twoId = liveMatch?.result[1];
	const two = twoId ? await getPlayer(twoId) : null;
	return one && two ? { id, players:[one, two] } : null;
}

const playerCache = new Map<string, Player>();
async function getPlayer(id: string): Promise<Player | null> {
	if (!playerCache.has(id)) {
		const url = `${getBot().playerUrl}"${id}"`;
		const availablePlayer = await getJson<AvailablePlayerResult>(url);
		// if (availablePlayer) console.log(JSON.stringify(availablePlayer))
		const name = availablePlayer?.result.name;
		if (name) {
			playerCache.set(id, { id, name });
		}
	}
	return playerCache.get(id) ?? null;
}

export type Payload = (MessageCreateOptions | MessageEditOptions) & { availablePlayers:number; };

export async function createPayload(): Promise<Payload>;
export async function createPayload<T extends MessageCreateOptions>(): Promise<T>;
export async function createPayload<T extends MessageEditOptions>(): Promise<T>;
export async function createPayload(): Promise<Payload> {
	const matches = [];
	const liveMatchIds = await getLiveMatchIds();
	for (const matchId of liveMatchIds) {
		const match = await getMatch(matchId);
		if (match) matches.push(match);
	}
	const matchesOutput = matches
		.map(match => `> ${match.players[0].name} vs ${match.players[1].name}`)
		.join("\n")
		.replace(/@/g, "@\\");

	const players: Player[] = [];
	const availablePlayerIds = await getAvailablePlayerIds();
	for (const playerId of availablePlayerIds) {
		const player = await getPlayer(playerId);
		if (player) players.push(player);
	}
	const playersOutput = players
		.map(player => `> ${player.name}`)
		.join("\n")
		.replace(/@/g, "@\\");

	// console.log({liveMatchIds,liveMatches,availablePlayerIds,availablePlayers})

	// const unixNow = Math.floor(Date.now() / 1000);

	const embed = new EmbedBuilder();
	embed.setTitle("Mana Storm (Beta) Activity Summary");
	embed.setDescription(`Play here: <https://manastorm.tinka.games/play>\nChat here: <https://discord.gg/ewar6KvsEU>`);
	embed.addFields(
		{ name:`**Available Players: ${availablePlayerIds.length}**`, value:playersOutput || `> *None*` },
		{ name:`**Active Matches: ${liveMatchIds.length}**`, value:matchesOutput || `> *None*` },
		// { name:`*Last Updated*`, value:`<t:${unixNow}:R>` }
	)
	embed.setTimestamp(Date.now());
	const embeds = [embed];

	return { content:``, embeds, availablePlayers:availablePlayerIds.length };
}