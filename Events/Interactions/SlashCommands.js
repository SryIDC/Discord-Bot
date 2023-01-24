const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "This command is outdated ❌.",
        ephemeral: true,
      });

    client.config = require("../../Main/config.json");

    if (command.developer && interaction.user.id !== client.config.devid)
      return interaction.reply({
        content: "This command can only be used by the developer.",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
