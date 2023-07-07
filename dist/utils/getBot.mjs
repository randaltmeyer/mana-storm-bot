import { existsSync, readFileSync, writeFileSync } from "fs";
let instance;
let isDevMode;
export class Bot {
    constructor(core) {
        this.core = core;
    }
    get id() { return this.core.id; }
    get token() { return this.core.token; }
    get homeId() { return this.core.homeId; }
    get playgroundId() { return this.core.playgroundId; }
    get channelDataPath() { return this.core.channelDataPath; }
    get availablePlayerListUrl() { return this.core.availablePlayerListUrl; }
    get liveMatchListUrl() { return this.core.liveMatchListUrl; }
    get matchUrl() { return this.core.matchUrl; }
    get playerUrl() { return this.core.playerUrl; }
    get refreshSeconds() { return this.core.refreshSeconds; }
    get channels() {
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
            }
            catch (ex) {
                console.error(ex);
                this._channels = [];
            }
        }
        return this._channels;
    }
    setChannel(channelData) {
        const existing = this.findChannel(channelData.guildId);
        if (existing) {
            existing.guildId = channelData.guildId;
            existing.channelId = channelData.channelId;
            existing.messageId = "";
        }
        else {
            this.channels.push({ ...channelData });
        }
        writeFileSync(this.channelDataPath, JSON.stringify(this.channels), "utf8");
        return true;
    }
    setMessage(message) {
        const channel = this.findChannel(message.channelId);
        if (channel) {
            channel.messageId = message.id;
            writeFileSync(this.channelDataPath, JSON.stringify(this.channels), "utf8");
            return true;
        }
        return false;
    }
    findChannel(idOrGuildId, channelId) {
        if (channelId) {
            return this.channels.find(ch => ch.channelId === channelId || ch.guildId === idOrGuildId);
        }
        return this.channels.find(ch => ch.channelId === idOrGuildId || ch.guildId === idOrGuildId);
    }
    getLastMessageId(guildId, channelId) {
        const channel = this.channels.find(ch => ch.guildId === guildId && ch.channelId === channelId);
        return channel?.messageId;
    }
    isMyMessage(message) {
        return message?.author?.id === this.id;
    }
    static get instance() {
        if (!instance) {
            try {
                const path = Bot.isDevMode ? "./data/dev.json" : "./data/bot.json";
                const contents = readFileSync(path, "utf8");
                const core = JSON.parse(contents);
                instance = new Bot(core);
            }
            catch (ex) {
                console.error(ex);
                instance = new Bot({});
            }
        }
        return instance;
    }
    static get isDevMode() {
        if (isDevMode === undefined) {
            isDevMode = process.argv.includes("--dev");
        }
        return isDevMode;
    }
    static isMyMessage(message) {
        return Bot.instance.isMyMessage(message);
    }
}
export function getBot() { return Bot.instance; }
