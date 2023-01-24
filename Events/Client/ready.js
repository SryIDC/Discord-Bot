const { ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log("Bot is now online🟢");
    client.user.setActivity("https://github.com/SryIDC/Discord-Bot", {
      type: ActivityType.Watching,
    });
    client.user.setPresence({ status: "dnd" });

    loadCommands(client);
  },
};
