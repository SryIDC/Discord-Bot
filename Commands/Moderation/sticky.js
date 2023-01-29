const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const stickySchema = require("../../schemas/stickySchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("Create a sticky message")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message for sticky")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("count")
        .setDescription("How frequently you want the sticky message to be sent")
        .setRequired(true)
    ),

  async execute(interaction) {
    let string = interaction.options.getString("message");
    let amount = interaction.options.getNumber("count") || 6;

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setDescription(string)
      .setFooter({ text: "This is a sticky message❗❗" });

    stickySchema.findOne(
      { ChannelID: interaction.channel.id },
      async (err, data) => {
        if (err) throw err;

        if (!data) {
          let msg = await interaction.channel.send({ embeds: [embed] });

          stickySchema.create({
            ChannelID: interaction.channel.id,
            Message: string,
            MaxCount: amount,
            LastMessageID: msg.id,
          });

          return await interaction.reply({
            content: "The sticky message has been setup",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content:
              "You already have a sticky message setup within this channel, please do /unstick to remove it",
            ephemeral: true,
          });
        }
      }
    );
  },
};
