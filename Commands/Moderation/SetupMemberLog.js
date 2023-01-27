const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const database = require("../../schemas/memberlog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-memberlog")
    .setDescription("Configure the member logging system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName("log-channel")
        .setDescription("Select logging channel")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((options) =>
      options
        .setName("member-role")
        .setDescription("Provide the role to be assigned after verification")
        .setRequired(true)
    )
    .addRoleOption((options) =>
      options
        .setName("bot-role")
        .setDescription("Set the role for new bots")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log-channel").id;

    let memberRole = options.getRole("member-role")
      ? options.getRole("member-role").id
      : null;

    let botRole = options.getRole("bot-role")
      ? options.getRole("bot-role").id
      : null;

    await database.findOneAndUpdate(
      { Guild: guild.id },
      {
        logChannel: logChannel,
        memberRole: memberRole,
        botRole: botRole,
      },
      { new: true, upsert: true }
    );

    client.guildConfig.set(guild.id, {
      logChannel: logChannel,
      memberRole: memberRole,
      botRole: botRole,
    });

    const MemberEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        [
          `-Logging Channel Updated:`,
          `- Member Verified Role Updated: ${
            memberRole ? ` <@&${memberRole}>` : "NOT SPECIFIED."
          }`,
          `-Bot Verified Role Updated: ${
            botRole ? `<@&${botRole}>` : "NOT SPECIFIED"
          }`,
        ].join("\n")
      );

    return interaction.reply({ embeds: [MemberEmbed] });
  },
};
