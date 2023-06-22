import { readFileSync } from "fs";

type Bot = {
	id: string;
	token: string;
	homeId: string;
	playgroundId: string;
	channelDataPath: string;

	availablePlayerListUrl: string;
	liveMatchListUrl: string;
	matchUrl: string;
	playerUrl: string;
}

let bot: Bot | undefined;
export function getBot(): Bot {
	if (!bot) {
		const contents = readFileSync("./bot.json", "utf8");
		try {
			bot = JSON.parse(contents);
		}catch(ex) {
			console.error(ex);
			bot = { } as Bot;
		}
	}
	return bot!;
}