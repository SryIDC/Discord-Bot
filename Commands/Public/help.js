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
      .setTitle("PiHosting Assistance")
      .setDescription(
        "Welcome to PiHosting, the best free hosting. Here's some information that will help you get started. Also take a look at our documentation using the button below if you need any help."
      )
      .addFields(
        { name: "\u200B", value: "\u200B" },
        {
          name: "Server IP'S",
          value: "US1: 209.126.6.98\nDE2: 185.215.166.122",
          inline: true,
        },
        {
          name: "Useful Channels",
          value: "#fivem-server-update\n#useful-downloads",
          inline: true,
        }
      )
      .addFields({
        name: "Support Channels",
        value: "#text-support\n#support-ticket",
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: "If you need more assistance contact support❗",
        iconURL: interaction.guild.iconURL(),
      });

    const helpcomponents = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel("Dashboard🖥")
        .setURL("https://client.pihosting.cloud")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("Panel💾")
        .setURL("https://panel.pihosting.cloud")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("Website☁")
        .setURL("https://pihosting.cloud")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel("Docs📃")
        .setURL("https://docs.pihosting.cloud")
        .setStyle(ButtonStyle.Link)
    );

    interaction.reply({ embeds: [helpembed], components: [helpcomponents] });
  },
};
