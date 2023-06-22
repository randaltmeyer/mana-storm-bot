import { canRespond } from "./canRespond.mjs";
export async function handleInteractionCreate(interaction) {
    if (!interaction.guild) {
        return;
    }
    if (!canRespond(interaction)) {
        return;
    }
    console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}
//# sourceMappingURL=handleInteractionCreate.mjs.map