import type { Message } from "discord.js";
import { existsSync, readFileSync, writeFileSync } from "fs";

type BotCore = {
	/** Bot User Id */
	id: string;
	/** App/Bot Token */
	token: string;

	/** Mana Storm Server */
	homeId: string;
	/** Dev Server */
	playgroundId: string;

	channelDataPath: string;

	availablePlayerListUrl: string;
	liveMatchListUrl: string;
	matchUrl: string;
	playerUrl: string;

	refreshSeconds: number;
}

export type ChannelData = {
	guildId: string;
	channelId: string;
	messageId: string;
}

let instance: Bot;
let isDevMode: boolean;
export class Bot {
	private constructor(private core: BotCore) { }

	/** Bot User Id */
	public get id() { return this.core.id; }

	/** App/Bot Token */
	public get token() { return this.core.token; }

	/** Mana Storm Server */
	public get homeId() { return this.core.homeId; }

	/** Dev Server */
	public get playgroundId() { return this.core.playgroundId; }

	public get channelDataPath() { return this.core.channelDataPath; }
	public get availablePlayerListUrl() { return this.core.availablePlayerListUrl; }
	public get liveMatchListUrl() { return this.core.liveMatchListUrl; }
	public get matchUrl() { return this.core.matchUrl; }
	public get playerUrl() { return this.core.playerUrl; }
	public get refreshSeconds() { return this.core.refreshSeconds; }

	private _channels?: ChannelData[];
	public get channels(): ChannelData[] {
		if (!this._channels) {
			try {
				if (existsSync(this.channelDataPath)) {
					const jsonString = readFileSync(this.channelDataPath, "utf8");
					this._channels = JSON.parse(jsonString);
				}
				if (!Array.isArray(this._channels)) {
					console.warn("Invalid channel data!");
					this._channels = [];
				}
			}catch(ex) {
				console.error(ex);
				this._channels = [];
			}
		}
		return this._channels;
	}
	public setChannel(channelData: ChannelData): boolean {
		const existing = this.findChannel(channelData.guildId);
		if (existing) {
			existing.guildId = channelData.guildId;
			existing.channelId = channelData.channelId;
			existing.messageId = "";
		}else {
			this.channels.push({ ...channelData });
		}

		// write new channels list
		writeFileSync(this.channelDataPath, JSON.stringify(this.channels), "utf8");

		return true;
	}
	setMessage(message: Message): boolean {
		const channel = this.findChannel(message.channelId);
		if (channel) {
			channel.messageId = message.id;
	
			// write new channels list
			writeFileSync(this.channelDataPath, JSON.stringify(this.channels), "utf8");

			return true;
		}
		return false;
	}

	public findChannel(id: string): ChannelData | undefined;
	// public findChannel(guildId: string, channelId: string): ChannelData | undefined;
	public findChannel(idOrGuildId: string, channelId?: string): ChannelData | undefined {
		if (channelId) {
			return this.channels.find(ch => ch.channelId === channelId || ch.guildId === idOrGuildId);
		}
		return this.channels.find(ch => ch.channelId === idOrGuildId || ch.guildId === idOrGuildId);
	}


	public getLastMessageId(guildId: string, channelId: string): string | undefined {
		const channel = this.channels.find(ch => ch.guildId === guildId && ch.channelId === channelId);
		return channel?.messageId;
	}

	public isMyMessage(message: Message) {
		return message?.author?.id === this.id;
	}

	public static get instance() {
		if (!instance) {
			try {
				const path = Bot.isDevMode ? "./data/dev.json" : "./data/bot.json";
				const contents = readFileSync(path, "utf8");
				const core = JSON.parse(contents);
				instance = new Bot(core);
			}catch(ex) {
				console.error(ex);
				instance = new Bot({ } as BotCore);
			}
		}
		return instance;
	}

	public static get isDevMode() {
		if (isDevMode === undefined) {
			isDevMode = process.argv.includes("--dev");
		}
		return isDevMode;
	}

	public static isMyMessage(message: Message) {
		return Bot.instance.isMyMessage(message);
	}
}

export function getBot(): Bot { return Bot.instance; }
