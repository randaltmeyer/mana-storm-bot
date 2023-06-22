import { readFileSync } from "fs";
let bot;
export function getBot() {
    if (!bot) {
        const contents = readFileSync("./bot.json", "utf8");
        try {
            bot = JSON.parse(contents);
        }
        catch (ex) {
            console.error(ex);
            bot = {};
        }
    }
    return bot;
}
//# sourceMappingURL=getBot.mjs.map