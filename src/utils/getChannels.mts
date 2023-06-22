import { existsSync, readFileSync } from "fs";
import { getBot } from "./getBot.mjs";

export type ChannelData = {
	guildId: string;
	channelId: string;
	messageId: string;
}

let channels: ChannelData[];
export function getChannels(): ChannelData[] {
	if (!channels) {
		try {
			const path = getBot().channelDataPath;
			if (existsSync(path)) {
				const jsonString = readFileSync(path, "utf8");
				channels = JSON.parse(jsonString);
			}
			if (!Array.isArray(channels)) {
				console.warn("Invalid channel data!");
				channels = [];
			}
		}catch(ex) {
			console.error(ex);
			channels = [];
		}
	}
	return channels;
}
