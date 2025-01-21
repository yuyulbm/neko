let { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const serverSchema = require("../../models/serverData");

module.exports = {
  data: {
    name: "counting",
    description: "setup a counting channel in your server.",
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    options: [
      {
        name: "channel",
        description: "counting channel",
        type: 7, // Channel type
        channelTypes: [0, 5],
        required: true,
      },
    ],
    integration_types: [0],
  },
  run: async (client, interaction, args, username) => {
    const { options } = interaction;
    let errorEmbed = new EmbedBuilder().setColor("Red");

    const channel = options.getChannel("channel");

    let server = await serverSchema.findOne({
      guildID: interaction.guild.id,
    });

    if (!server)
      server = await serverSchema.create({
        guildID: interaction.guild.id,
      });

    server.countingSystem.channel = channel.id;

    await server.save();

    let embed = new EmbedBuilder()
      .setDescription(
        `Successfully set counting channel to <#${server.countingSystem.channel}>!`
      )
      .setColor("#8c4ec4");

    await interaction.reply({
      embeds: [embed],
    });
  },
};
