import { MessageCreateOptions, MessageEditOptions } from "discord.js";
export type Payload = (MessageCreateOptions | MessageEditOptions) & {
    availablePlayers: number;
};
export declare function createPayload(): Promise<Payload>;
export declare function createPayload<T extends MessageCreateOptions>(): Promise<T>;
export declare function createPayload<T extends MessageEditOptions>(): Promise<T>;
//# sourceMappingURL=createPayload.d.mts.map