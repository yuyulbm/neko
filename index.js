const express = require("express");
const app = express();
const {
  Client,
  Collection,
  EmbedBuilder,
  Intents,
  Partials,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    //GatewayIntentBits.AutoModerationConfiguration,
    //GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
  ],
  restTimeOffset: 0,
  restRequestTimeout: 60000,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: [Partials.Message, Partials.Reaction],
});

module.exports = client;
client.slashCommands = new Collection();
client.commands = new Collection();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./handler")(client);
app.listen(process.env.PORT || 80, () => {
  console.log("Server Started");
});

client.login(config.token);

// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});
