import { ActivityType, Client } from "discord.js";
import { postSummaryToClient } from "../utils/postSummaryToClient.mjs";
import { Bot } from "../utils/getBot.mjs";

export async function handleReady(client: Client): Promise<void> {
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

async function onInterval(client: Client) {
	postSummaryToClient(client);
}