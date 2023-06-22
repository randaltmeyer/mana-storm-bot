import { Client, IntentsBitField } from "discord.js";
// import { handleInteractionCreate } from "./handlers/handleInteractionCreate.mjs";
import { handleMessageCreate } from "./handlers/handleMessageCreate.mjs";
import { handleReady } from "./handlers/handleReady.mjs";
import { getBot } from "./utils/getBot.mjs";

const intents = [
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.DirectMessageReactions,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	// IntentsBitField.Flags.MessageContent
];

const clientOptions = { intents };
const client = new Client(clientOptions);
client.once("ready", handleReady);
// client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreate);
client.login(getBot()?.token ?? "");

// node app.mjs
// pm2 start app.mjs --name mana-storm-bot
