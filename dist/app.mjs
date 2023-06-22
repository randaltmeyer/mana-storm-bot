import { Client, IntentsBitField } from "discord.js";
import { handleMessageCreate } from "./handlers/handleMessageCreate.mjs";
import { handleReady } from "./handlers/handleReady.mjs";
import { getBot } from "./utils/getBot.mjs";
const intents = [
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
];
const clientOptions = { intents };
const client = new Client(clientOptions);
client.once("ready", handleReady);
client.on("messageCreate", handleMessageCreate);
client.login(getBot()?.token ?? "");
//# sourceMappingURL=app.mjs.map