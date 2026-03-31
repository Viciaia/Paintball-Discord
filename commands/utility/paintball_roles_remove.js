const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('paintball_roles_remove')
		.setDescription('Delete all paintball roles(start with paintball-)')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),//only admin can use this slash command
	async execute(interaction) {
		const guild = interaction.guild;
		const me = guild?.members?.me;

		if (!guild || !me) {
			await interaction.reply({
				content: 'This command can only be used in a server.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
			await interaction.reply({
				content: 'I need the Manage Roles permission first.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		try {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			//filter roles with prefix paintball-
			const candidateRoles = guild.roles.cache.filter((role) =>
				role.name.startsWith('paintball-'));

			//check if there are any roles with prefix paintball-
			if (!candidateRoles.size) {
				await interaction.editReply({
					content: '⚠️No roles found with prefix paintball-.',
				});
				return;
			}
			//loop and delete the roles
			let deletedCount = 0;
			for (const role of candidateRoles.values()) {
				await role.delete(`Requested by ${interaction.user.tag}`);
				deletedCount += 1;
			}

			
			await interaction.editReply({
				content: `🗑️Deleted ${deletedCount} role(s) for the paintball event`,
			});
		}
		catch (error) {
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
