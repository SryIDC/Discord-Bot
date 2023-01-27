const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command with whatever you need"),

  async execute(interaction) {
    const helpembed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("TITLE")
      .setDescription(
        "DESCRIPTION"
      )
      .addFields(
        { name: "\u200B", value: "\u200B" },
        {
          name: "NAME",
          value: "VALUE",
          inline: true,
        },
        {
          name: "NAME",
          value: "VALUE",
          inline: true,
        }
      )
      .addFields({
        name: "NAME",
        value: "VALUE",
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: "Footer",
        iconURL: interaction.guild.iconURL(),
      });

    const helpcomponents = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("button1")
        .setLabel("Button 1")
        .setemoji("❌")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel("URL")
        .setURL("url")
        .setStyle(ButtonStyle.Link)
    );

    interaction.reply({ embeds: [helpembed], components: [helpcomponents] });
  },
};
