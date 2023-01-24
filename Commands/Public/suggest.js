const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest something")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title of your suggestion.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Detailed description of your suggestion")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { guild, options, member } = interaction;

    const title = options.getString("title");
    const description = options.getString("description");

    const embed = new EmbedBuilder()
      .setColor("Green")
      .addFields(
        { name: "Suggestion", value: `${title}`, inline: true },
        { name: "Description", value: `${description}`, inline: true }
      )
      .setFooter({
        text: `Suggested By: ${member.user.tag} Kindly vote for the suggestion!`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      });

    client.config = require("../../Main/config.json");

    await guild.channels.cache
      .get(client.config.suggestion)
      .send({
        embeds: [embed],
      })
      .then((s) => {
        s.react("🟢");
        s.react("🔴");
      })
      .catch((err) => {
        throw err;
      });

    interaction.reply({
      content:
        ":white_check_mark: | Your suggestion has been successfully submitted.",
      ephemeral: true,
    });
  },
};
