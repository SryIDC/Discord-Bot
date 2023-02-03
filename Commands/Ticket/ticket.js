const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { Types } = require("mongoose");

const ticketSchema = require("../../schemas/ticketSchema");
const userSchema = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket Options")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("closerequest")
        .setDescription("Close request command")
        .addStringOption((option) => {
          return option
            .setName("description")
            .setDescription("reason for closing the ticket")
            .setRequired(true);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("close-ticket")
        .setDescription("Close ticket command.")
        .addStringOption((option) => {
          return option
            .setName("description")
            .setDescription("reason for closing the ticket")
            .setRequired(true);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("claim").setDescription("Claim ticket!")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "closerequest") {
      const description = interaction.options.getString("description");
      const { channel, member, guild, customId } = interaction;

      await interaction.reply({
        content: "Close request sent!",
        ephemeral: true,
      });

      const RequestEmbed = new EmbedBuilder()
        .setTitle("Ticket System")
        .setDescription(description)
        .setFooter({
          text: `Requested to close by ${
            member.user.tag
          }🙋‍♂️\nRequested at: ${new Date().toLocaleString()}`,
          iconURL: client.user.displayAvatarURL(),
        });

      interaction.channel.send({
        embeds: [RequestEmbed],
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("closeTicket")
              .setEmoji("🔐")
              .setLabel("Close Ticket")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("donotclose")
              .setEmoji("⛔")
              .setLabel("Do close this ticket?")
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "close-ticket") {
      const { channel, member, guild, customId } = interaction;
      const ticketsData = await ticketSchema.findOne({
        guildId: guild.id,
      });
      const usersData = await userSchema.findOne({
        guildId: guild.id,
        ticketId: channel.id,
      });

      if (usersData.closed === true)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("The ticket is already closed.")
              .setColor("0x2F3136"),
          ],
        });

      await userSchema.updateMany(
        {
          ticketId: channel.id,
        },
        {
          closed: true,
          closer: member.id,
        }
      );

      if (!usersData.closer == member.id)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You are not the user that closed this ticket!")
              .setColor("Red"),
          ],
          ephemeral: true,
        });

      client.channels.cache
        .get(usersData.ticketId)
        .permissionOverwrites.edit(usersData.creatorId, {
          ViewChannel: false,
        });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Ticket Closed")
            .setDescription(
              "The ticket has been closed, the user who created this ticket cannot see it now!"
            )
            .addFields(
              {
                name: "Ticket Creator",
                value: `<@${usersData.creatorId}> created this ticket.`,
              },
              {
                name: "Ticket Closer",
                value: `<@${member.user.id}> closed this ticket.`,
              },
              {
                name: "Closed at",
                value: `${new Date().toLocaleString()}`,
              }
            )
            .setFooter({
              text: `${client.user.tag}`,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("reopenTicket")
              .setEmoji("🔓")
              .setLabel("Reopen")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("deleteTicket")
              .setEmoji("⛔")
              .setLabel("Delete")
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });
    }
    if (interaction.options.getSubcommand() === "claim") {
      const { channel, member, guild, customId } = interaction;
      const ticketDat = await ticketSchema.findOne({
        guildId: guild.id,
      });
      const userDat = await userSchema.findOne({
        guildId: guild.id,
        ticketId: channel.id,
      });

      if (userDat.claimed === true)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`Ticket has been claimed already.`),
          ],
          ephemeral: true,
        });

      await userSchema.updateMany(
        {
          ticketId: channel.id,
        },
        {
          claimed: true,
          claimer: member.id,
        }
      );

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`Ticket has been claimed`),
        ],
        ephemeral: true,
      });
    }
  },
};
