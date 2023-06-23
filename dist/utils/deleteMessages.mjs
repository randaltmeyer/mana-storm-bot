import { Bot } from "./getBot.mjs";
export async function deleteMessages(guildChannel) {
    const bot = Bot.instance;
    let lastMessageId;
    const messageCollection = await guildChannel.messages.fetch({ limit: 10 });
    const messages = messageCollection.values();
    for (const message of messages) {
        if (bot.isMyMessage(message)) {
            const isLastMessage = message.id === guildChannel.lastMessageId;
            if (isLastMessage) {
                lastMessageId = message.id;
            }
            else if (message.deletable) {
                await message.delete();
            }
        }
    }
    return lastMessageId;
}
