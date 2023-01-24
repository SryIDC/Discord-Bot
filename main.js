const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./Main/config.json");
client.events = new Collection();
client.commands = new Collection();

const { connect } = require("mongoose");
connect(client.config.DatabaseURL, {}).then(() =>
  console.log("Client is now connected to the database 🟢.")
);

loadEvents(client);

client.login(client.config.token);
