import type { Message } from "discord.js";
export type ChannelData = {
    guildId: string;
    channelId: string;
    messageId: string;
};
export declare class Bot {
    private core;
    private constructor();
    get id(): string;
    get token(): string;
    get homeId(): string;
    get playgroundId(): string;
    get channelDataPath(): string;
    get availablePlayerListUrl(): string;
    get liveMatchListUrl(): string;
    get matchUrl(): string;
    get playerUrl(): string;
    get refreshSeconds(): number;
    private _channels?;
    get channels(): ChannelData[];
    setChannel(channelData: ChannelData): boolean;
    setMessage(message: Message): boolean;
    findChannel(id: string): ChannelData | undefined;
    getLastMessageId(guildId: string, channelId: string): string | undefined;
    isMyMessage(message: Message): boolean;
    static get instance(): Bot;
    static get isDevMode(): boolean;
    static isMyMessage(message: Message): boolean;
}
export declare function getBot(): Bot;
//# sourceMappingURL=getBot.d.mts.map