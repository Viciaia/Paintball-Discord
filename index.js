require("dotenv").config();
// Require the necessary discord.js classes
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
const { paintballChannelId } = require("./config.json");

const fs = require("node:fs");
const path = require("node:path");
const token = process.env.DISCORD_TOKEN;
//paintball server channel id
const PAINTBALL_CHANNEL_ID = paintballChannelId;

if (!token) {
  throw new Error("DISCORD_TOKEN is missing. Add it to your .env file.");
}
// Create a new client instance
// GuildMembers intent is privileged — if disabled in the Developer Portal, Discord
// disconnects with "Used disallowed intents". Member lookup uses REST (fetch), so it
// does not require the gateway members intent.
// Message Content intent must stay enabled in the portal for message.content in servers.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});
////////////////////////////
// Paintball event related code
////////////////////////////

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  //check if the message is in the paintball channel
  if (message.channelId !== PAINTBALL_CHANNEL_ID) return;

  //regex is magic here..
  const match = message.content
    .trim()
    .match(/^([🔴🟠🟡🟢🔵🟣⚫⚪🟤])\s*<@!?(\d+)>/u);

  if (match) {
    //classic switch case to get the new color
    let newBallColor;
    switch (match[1]) {
      case "🔴":
        newBallColor = "red";
        break;
      case "🟠":
        newBallColor = "orange";
        break;
      case "🟡":
        newBallColor = "yellow";
        break;
      case "🟢":
        newBallColor = "green";
        break;
      case "🔵":
        newBallColor = "blue";
        break;
      case "🟣":
        newBallColor = "purple";
        break;
      case "⚫":
        newBallColor = "black";
        break;
      case "⚪":
        newBallColor = "white";
        break;
      case "🟤":
        newBallColor = "brown";
        break;
      default:
        newBallColor = match[1];
        break;
    }

    const userId = match[2];
    const guild = message.guild;
    if (!guild) return;

    try {
      const member = await guild.members.fetch(userId);
      const paintballRole = member.roles.cache.find((role) =>
        role.name.startsWith("paintball-"),
      );
      if (paintballRole) {
        //split the role name to get the current color
        //ballColor[2] is the lastest color
        const ballColor = paintballRole.name.split("-");

        // remove current paintball role
        await member.roles.remove(paintballRole);
        //add the new color paintball role
        const newRole = guild.roles.cache.find(
          (role) =>
            role.name === "paintball-" + ballColor[2] + "-" + newBallColor,
        );
        if (newRole) {
          await member.roles.add(newRole);
          //you may random the reaction to the message
          await message.reply(
            `Ouch!! <@${userId}> got hit by a ${match[1]} ball!!`,
          );
        }
      } else {
        const newRole = guild.roles.cache.find(
          (role) =>
            role.name === "paintball-" + newBallColor + "-" + newBallColor,
        );
        if (newRole) {
          await member.roles.add(newRole);
          await message.reply(
            `Ouch!! <@${userId}> got hit by a ${match[1]} ball!!`,
          );
        }
      }
    } catch {
      await message.reply(
        `Could not resolve member <@${userId}> in this server.`,
      );
    }
  }
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
