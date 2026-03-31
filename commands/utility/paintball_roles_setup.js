const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

//a slash command to create pre paintball roles for the event
//there will be 9 roles, with single color and the rest 72 roles with gradient color
//the roles will be created directly below the bot role
//they will started with painball-
module.exports = {
  data: new SlashCommandBuilder()
    .setName("paintball_roles_setup")
    .setDescription("Create roles for Paintball event")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), //only admin can use this slash command
  async execute(interaction) {
    // start permission check
    const guild = interaction.guild;
    const me = guild?.members?.me;
    //command is only available for admin
    if (!guild || !me) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    //bot must have manage roles permission
    if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({
        content:
          "I need the **Manage Roles** permission, and my top role must be above the roles I create.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const roleName = [
      "orange",
      "red",
      "blue",
      "black",
      "brown",
      "green",
      "purple",
      "white",
      "yellow",
    ];

    const roleColor = [
      "#f99c00", // orange
      "#e32744", // red
      "#5aa5dc", // blue
      "#353f4c", // black-ish
      "#c36f51", // brown
      "#79b25a", // green
      "#9e88c9", // purple
      "#c6c7c9", // white-ish
      "#f0c75a", // yellow
    ];
    const mentionable = false;

    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      await guild.roles.fetch();
      const botMember = await guild.members.fetchMe({ force: true });
      const botRole = botMember.roles.highest;
      const n = roleName.length;
      let createdCount = 0;
      let nextPosition = botRole.position - 1;

      //check if there are already roles with prefix paintball-
      const candidateRoles = guild.roles.cache.filter((role) =>
        role.name.startsWith("paintball-"),
      );

      if (candidateRoles.size) {
        await interaction.editReply({
          content: "⚠️There are already roles with prefix paintball-",
        });
        return;
      }
      //loop for create 81 specific roles for the paintball event
      //This will take some times
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          await guild.roles.create({
            name: `paintball-${roleName[i]}-${roleName[j]}`,
            colors: {
              primaryColor: roleColor[i],
              secondaryColor: roleColor[j],
            },
            mentionable,
            reason: "paintball Role setup",
            position: botRole.position - createdCount, //arrange the role under bot role
          });
          createdCount += 1;
        }
      }

      await interaction.editReply({
        content: `✨✨ Finished creating ${createdCount} paintball roles.`,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.message;
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: errorMessage });
        return;
      }

      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
