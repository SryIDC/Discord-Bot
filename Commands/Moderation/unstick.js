const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const stickySchema = require("../../schemas/stickySchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unstick")
    .setDescription("Unsticks a sticky message")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const data = await stickySchema.findOne({
      ChannelID: interaction.channel.id,
    });

    if (!data) {
      return await interaction.reply({
        content: "There is no sticky message in this channel",
        ephemeral: true,
      });
    } else {
      try {
        interaction.client.channels.cache
          .get(data.ChannelID)
          .messages.fetch(data.LastMessageID)
          .then(async (m) => {
            await m.delete();
          });
      } catch {
        return;
      }
    }

    stickySchema.deleteMany(
      { ChannelID: interaction.channel.id },
      async (err, data) => {
        if (err) throw err;

        return await interaction.reply({
          content:
            "The current sticky message within this channel has been delete",
          ephemeral: true,
        });
      }
    );
  },
};
