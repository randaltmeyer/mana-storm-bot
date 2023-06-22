import { ActivityType } from "discord.js";
import { isDevMode } from "../utils/isDevMode.mjs";
import { postSummaryToClient } from "../utils/postSummaryToClient.mjs";
export async function handleReady(client) {
    client.user?.setPresence({
        status: "online"
    });
    client.user?.setActivity("Monitoring games ...", {
        type: ActivityType.Watching
    });
    console.log(isDevMode() ? "Dev Mode Ready" : "Bot Ready");
    setInterval(onInterval, 1000 * 30, client);
    onInterval(client);
}
async function onInterval(client) {
    postSummaryToClient(client);
}
//# sourceMappingURL=handleReady.mjs.map