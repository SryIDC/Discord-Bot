const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

const Transcripts = require("discord-html-transcripts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete Messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption((options) =>
      options
        .setName("amount")
        .setDescription("Provide the amount of messages you intend to delete.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Provide the reason why you are clearing messages.")
        .setRequired(true)
    )
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("Provide the username to delete only their messages.")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Amount = interaction.options.getNumber("amount");
    const Reason = interaction.options.getString("reason");
    const Target = interaction.options.getUser("target");

    const channelMessages = await interaction.channel.messages.fetch();
    client.config = require("../../Main/config.json");
    const logChannel = interaction.guild.channels.cache.get(
      client.config.clearlog
    );

    const responseEmbed = new EmbedBuilder().setColor("DarkNavy");
    const logEmbed = new EmbedBuilder()
      .setColor("DarkAqua")
      .setAuthor({ name: "CLEAR COMMAND USED" });

    logEmbedDescription = [
      `⭕ Moderator: ${interaction.member}`,
      `⭕ Target: ${Target || "None"}`,
      `⭕ Channel: ${interaction.channel}`,
      `⭕ Reason: ${Reason}`,
    ];

    if (Target) {
      let i = 0;
      let messagesToDelete = [];
      channelMessages.filter((message) => {
        if (message.author.id === Target.id && Amount > i) {
          messagesToDelete.push(message);
          i++;
        }
      });

      const Transcript = await Transcripts.generateFromMessages(
        messagesToDelete,
        interaction.channel
      );

      interaction.channel
        .bulkDelete(messagesToDelete, true)
        .then((messages) => {
          interaction.reply({
            embeds: [
              responseEmbed.setDescription(`🧹 Cleared \`${messages.size}\``),
            ],
            ephemeral: true,
          });

          logEmbedDescription.push(`⭕ Total Messages: ${messages.size}`);
          logChannel.send({
            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
            files: [Transcript],
          });
        });
    } else {
      const Transcript = await Transcripts.createTranscript(
        interaction.channel,
        { limit: Amount }
      );

      interaction.channel.bulkDelete(Amount, true).then((messages) => {
        interaction.reply({
          embeds: [
            responseEmbed.setDescription(`🧹 Cleared \`${messages.size}\``),
          ],
          ephemeral: true,
        });

        logEmbedDescription.push(`⭕ Total Messages: ${messages.size}`);
        logChannel.send({
          embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
          files: [Transcript],
        });
      });
    }
  },
};
