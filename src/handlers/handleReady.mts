import { ActivityType, Client } from "discord.js";
import { isDevMode } from "../utils/isDevMode.mjs";
import { postSummaryToClient } from "../utils/postSummaryToClient.mjs";
import { getBot } from "../utils/getBot.mjs";

export async function handleReady(client: Client): Promise<void> {
	client.user?.setPresence({
		status: "online"
	});

	client.user?.setActivity("Monitoring games ...", {
		type: ActivityType.Watching
	});

	console.log(isDevMode() ? "Dev Mode Ready" : "Bot Ready");

	setInterval(onInterval, 1000 * getBot().refreshSeconds, client);
	onInterval(client);
}

async function onInterval(client: Client) {
	postSummaryToClient(client);
}