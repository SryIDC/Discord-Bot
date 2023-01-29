const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Events,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./Main/config.json");
client.events = new Collection();
client.commands = new Collection();
client.guildConfig = new Collection();

const { connect } = require("mongoose");
connect(client.config.DatabaseURL, {}).then(() =>
  console.log("Client is now connected to the database 🟢.")
);

loadEvents(client);

const { loadConfig } = require("./Functions/configLoader");
loadConfig(client);

const stickySchema = require("./schemas/stickySchema");

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  stickySchema.findOne({ ChannelID: message.channel.id }, async (err, data) => {
    if (err) throw err;

    if (!data) {
      return;
    }

    let channel = data.ChannelID;
    let cachedChannel = client.channels.cache.get(channel);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(data.Message)
      .setFooter({ text: "This is a sticky message" });

    if (message.channel.id == channel) {
      data.CurrentCount += 1;
      data.save();

      if (data.CurrentCount > data.MaxCount) {
        try {
          await client.channels.cache
            .get(channel)
            .messages.fetch(data.LastMessageID)
            .then(async (m) => {
              await m.delete();
            });

          let newMessage = await cachedChannel.send({ embeds: [embed] });

          data.LastMessageID = newMessage.id;
          data.CurrentCount = 0;
          data.save();
        } catch {
          return;
        }
      }
    }
  });
});

client.login(client.config.token);
