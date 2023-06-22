import { existsSync, readFileSync } from "fs";
import { getBot } from "./getBot.mjs";
let channels;
export function getChannels() {
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
        }
        catch (ex) {
            console.error(ex);
            channels = [];
        }
    }
    return channels;
}
//# sourceMappingURL=getChannels.mjs.map