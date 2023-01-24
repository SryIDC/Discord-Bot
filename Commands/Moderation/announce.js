const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce something")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "Select the channel you want to send the announcement to"
        )
        .setRequired(true)
    )
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

    const Channel = options.getChannel("channel");

    const title = options.getString("title");
    const description = options.getString("description");

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle({
        content: "NEW ANNOUNCEMENT",
        iconURL: interaction.guild.iconURL(),
      })
      .addFields(
        { name: "Suggestion", value: `${title}`, inline: false },
        { name: "Description", value: `${description}`, inline: false }
      )
      .setFooter({
        text: `Announcement By: ${member.user.tag}!`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      });

    await guild.channels.cache
      .get(Channel)
      .send({
        embeds: [embed],
      })
      .then((s) => {
        s.react("👍");
      })
      .catch((err) => {
        throw err;
      });

    interaction.reply({
      content:
        ":white_check_mark: | Your announcement has been successfully sent.",
      ephemeral: true,
    });
  },
};
