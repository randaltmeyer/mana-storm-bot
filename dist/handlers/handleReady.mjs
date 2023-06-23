import { ActivityType } from "discord.js";
import { postSummaryToClient } from "../utils/postSummaryToClient.mjs";
import { Bot } from "../utils/getBot.mjs";
export async function handleReady(client) {
    client.user?.setPresence({
        status: "online"
    });
    client.user?.setActivity("Monitoring games ...", {
        type: ActivityType.Watching
    });
    console.log(Bot.isDevMode ? "Dev Mode Ready" : "Bot Ready");
    setInterval(onInterval, 1000 * Bot.instance.refreshSeconds, client);
    onInterval(client);
}
async function onInterval(client) {
    postSummaryToClient(client);
}
//# sourceMappingURL=handleReady.mjs.map