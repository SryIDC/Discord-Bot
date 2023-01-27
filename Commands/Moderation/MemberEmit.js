const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memberemit")
    .setDescription("Emit the guildMemberAdd/Remove test")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    client.emit("guildMemberAdd", interaction.member);

    interaction.reply({ content: "Emitted GuildMemberAdd", ephemeral: true });
  },
};
