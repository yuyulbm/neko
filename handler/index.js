const { glob } = require("glob");
// If you're using this make sure to downgrade gob to 7.2.0 or this won't work
const { promisify } = require("util");
const { Client, SlashCommandBuilder, REST, Routes } = require("discord.js");
const mongoose = require("mongoose");
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Command handler
  const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`); // looks for the folder named commands
  commandFiles.map((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (file.name) {
      const properties = { directory, ...file };
      client.commands.set(file.name, properties);
    } //allows command
  });

  // Event handler
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`); //looks for folder named events
  eventFiles.map((value) => require(value));

  // Slash Commands handler
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const command = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];
    if (!command?.data.name) return;
    const properties = { directory, ...command };
    client.slashCommands.set(command.data.name, properties);

    //if (["MESSAGE", "USER"].includes(command.type)) delete command.description;

    if (command.data instanceof SlashCommandBuilder)
      arrayOfSlashCommands.push(command.data.toJSON());
    else arrayOfSlashCommands.push(command.data);
  });

  const rest = new REST().setToken(process.env.token);
  //const rest = new REST().setToken(client.config.token);

  // Set commands via the REST API
  (async () => {
    try {
      const commands = await rest.put(
        Routes.applicationCommands("1327724156493762560"),
        //Routes.applicationCommands(client.config.ID),
        {
          body: arrayOfSlashCommands,
        }
      );

      commands.map((cm) => {
        let obj = client.slashCommands.get(cm.name);
        if (obj) obj.id = cm.id;
      });
    } catch (error) {
      console.error(error);
    }
  })();

  mongoose.set("strictQuery", true);

  /*await mongoose
  .connect(client.config.mongo)
  .then(() => console.log("Connected to mongodb"));*/

  await mongoose
    .connect(process.env.mongo)
    .then(() => console.log("Connected to mongodb"));
};
