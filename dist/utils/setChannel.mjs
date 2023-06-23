import { getBot } from "./getBot.mjs";
import { postSummaryToGuild } from "./postSummaryToGuild.mjs";
import { deleteMessages } from "./deleteMessages.mjs";
export async function setChannel(guildChannel) {
    await deleteMessages(guildChannel);
    getBot().setChannel({ guildId: guildChannel.guildId, channelId: guildChannel.id, messageId: "" });
    await postSummaryToGuild(guildChannel.guild);
}
