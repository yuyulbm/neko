const express = require("express");
const app = express();
const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
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
client.config = config;
client.slashCommands = new Collection();
client.commands = new Collection();
client.staff = [
  "748597084134834186",
  "613475285744222248",
  "931011058078986302",
];

require("./handler")(client);

app.listen(process.env.PORT || 80, () => {
  console.log("Server Started");
});

//client.login(config.token);
client.login(process.env.token);

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
