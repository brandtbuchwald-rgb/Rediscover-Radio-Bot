import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log("Frequency 47 online.");
});


function randomLine(file) {
  const lines = fs.readFileSync(`./data/${file}`, "utf-8").split("\n").filter(Boolean);
  return lines[Math.floor(Math.random() * lines.length)];
}

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  if (msg.content.startsWith("!ping47")) {
    msg.reply("Frequency 47 online. Noise stable.");
  }

  if (msg.content.startsWith("!audit")) {
  const header = randomLine("headers.txt");
  const subject = randomLine("subjects.txt");
  const metric1 = randomLine("metrics.txt");
  const metric2 = randomLine("metrics.txt");
  const rec = randomLine("recommendations.txt");
  const verdict = randomLine("verdicts.txt");

  // Default color
  let color = 0x00ff88;
  const textBlock = `${subject}\n${metric1}\n${metric2}\n${rec}\n${verdict}`;
  const lowerText = textBlock.toLowerCase();

  if (lowerText.includes("critical") || lowerText.includes("fracturing")) color = 0xff3333;
  else if (lowerText.includes("unstable") || lowerText.includes("rising")) color = 0xffa500;
  else if (lowerText.includes("moderate") || lowerText.includes("variance")) color = 0xffff66;
  else color = 0x00ff88;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`⚙️ ${header}`)
    .setDescription(
      `\`\`\`ini
[Subsystem Integrity]
${subject}

[Diagnostics]
${metric1}
${metric2}

[Recommendation]
${rec}

[Verdict]
${verdict}
\`\`\``
    )
    .setFooter({ text: "– Sagewright // Audit Complete" })
    .setTimestamp();

  msg.channel.send({ embeds: [embed] });
}
if (msg.content.startsWith("!diagnose")) {
  // Grab the mentioned user or default to the author
  const target =
    msg.mentions.users.first() || msg.author;

  const header = randomLine("headers.txt");
  const subject = `Entity: ${target.username}`;
  const metric1 = randomLine("metrics.txt");
  const metric2 = randomLine("metrics.txt");
  const rec = randomLine("recommendations.txt");
  const verdict = randomLine("verdicts.txt");

  // Default color
  let color = 0x00ff88;
  const textBlock = `${subject}\n${metric1}\n${metric2}\n${rec}\n${verdict}`.toLowerCase();

  if (textBlock.includes("critical") || textBlock.includes("fracturing")) color = 0xff3333;
  else if (textBlock.includes("unstable") || textBlock.includes("rising")) color = 0xffa500;
  else if (textBlock.includes("moderate") || textBlock.includes("variance")) color = 0xffff66;
  else color = 0x00ff88;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`🩺 Diagnostic Report – ${header}`)
    .setDescription(
      `\`\`\`ini
[Subject]
${subject}

[Readings]
${metric1}
${metric2}

[Prescription]
${rec}

[Prognosis]
${verdict}
\`\`\``
    )
    .setFooter({ text: "– Sagewright // Personal Audit Complete" })
    .setTimestamp();

  msg.channel.send({ embeds: [embed] });
  // Optional log to a specific channel
const logChannel = msg.guild.channels.cache.find(ch => ch.name === "audit-log");
if (logChannel) {
  logChannel.send({ embeds: [embed] });
}

}

});
client.on("guildMemberAdd", async (member) => {
  const { EmbedBuilder } = await import("discord.js");

  // Find the welcomer channel directly
  const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === "welcomer");

  // Build the embedded welcome
  const embed = new EmbedBuilder()
    .setColor(0x00ff88)
    .setTitle("📡 Incoming Transmission — Frequency 47")
    .setDescription(
      `\`\`\`ini
[Connection Established]
User: ${member.user.username}
ID: ${member.id}
Signal Status: ACTIVE
Noise Sync: SUCCESSFUL

[Welcome Protocol]
Greetings, ${member.user.username}.
You have entered the Rediscover Network.
Type !diagnose in #general to confirm system integrity.

Maintenance is faith.
Broken is honest.
The Noise is proof.
\`\`\``
    )
    .setFooter({ text: "— Frequency 47 // System Acknowledged" })
    .setTimestamp();

  // DM welcome
  try {
    await member.send({ embeds: [embed] });
  } catch (err) {
    console.log(`Couldn't DM ${member.user.username} (DMs disabled).`);
  }

  // Public welcome message
  if (welcomeChannel) {
    await welcomeChannel.send({
      content: `🟢 **Signal handshake detected.** ${member} has joined the broadcast.`,
      embeds: [embed]
    });
  } else {
    console.log("⚠️ No #welcomer channel found. Skipping public message.");
  }

  // Auto-assign Frequency Initiate role
  try {
    const role = member.guild.roles.cache.find(r => r.name === "Frequency Initiate");
    if (role) {
      await member.roles.add(role);
      console.log(`Assigned Initiate role to ${member.user.username}`);
    }
  } catch (err) {
    console.error(`Failed to assign role to ${member.user.username}:`, err);
  }
});


// --- Slash Command Loader (Phase III upgrade) ---
import { REST, Routes, Collection } from "discord.js";


client.commands = new Collection();

// Load commands dynamically from ./commands folder
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
const commands = [];

for (const file of commandFiles) {
  const cmd = await import(`./commands/${file}`);
  client.commands.set(cmd.default.data.name, cmd.default);
  commands.push(cmd.default.data.toJSON());
}

// Register slash commands once the bot is ready
client.once("ready", async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
  Routes.applicationGuildCommands(client.user.id, "1431496011217637501"),
  { body: commands }
);
console.log("Slash commands synced to Discord (guild scope).");

  } catch (err) {
    console.error("Slash registration error:", err);
  }
});

client.on("interactionCreate", async (interaction) => {
  console.log("Interaction detected:", interaction.commandName);

  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "⚠️ Static interference detected.",
      ephemeral: true
    });
  }
});




const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Load events dynamically
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));
  for (const file of eventFiles) {
    const evt  = await import(`./events/${file}`);
    const name = evt.default.name;
    const once = evt.default.once || false;
    if (!name || !evt.default.execute) continue;
    once
      ? client.once(name, (...args) => evt.default.execute({ client, args }))
      : client.on (name, (...args) => evt.default.execute({ client, args }));

    console.log(`Event loaded: ${file}`);
  }
}

client.login(process.env.DISCORD_TOKEN);
