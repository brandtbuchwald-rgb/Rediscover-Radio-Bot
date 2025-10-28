import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";

export default {
  data: new SlashCommandBuilder()
    .setName("transmission")
    .setDescription("Retrieve a random broadcast fragment from the Rediscover archives."),
  async execute(interaction) {
    try {
      const data = fs.readFileSync("./data/Sagewright coded.txt", "utf-8");

      // Normalize line endings and separators
      const normalized = data.replace(/\r\n/g, "\n");

      // Split on any line that contains three or more dashes (with or without spaces)
      const entries = normalized
        .split(/\n?-{3,}\n?/g)
        .map(e => e.trim())
        .filter(Boolean);

      const random = entries[Math.floor(Math.random() * entries.length)];

      const embed = new EmbedBuilder()
        .setColor(0x22ff77)
        .setTitle("📡 Transmission Archive")
        .setDescription(random.length > 4000 ? random.slice(0, 3997) + "..." : random)
        .setFooter({ text: "Frequency 47 — The noise persists." })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "⚠️ Archive corrupted. Unable to access coded fragment.",
        ephemeral: true
      });
    }
  }
};
