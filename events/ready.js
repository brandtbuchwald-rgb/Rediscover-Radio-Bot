import cron from "node-cron";
import { EmbedBuilder } from "discord.js";

export default {
  name: "ready",
  once: true,
  async execute({ client }) {
    console.log("Frequency 47: Chamber online.");
    
    // Set bot presence
    client.user.setPresence({
      activities: [{ name: "Signal Integrity" }],
      status: "online",
    });

    // 🕛 Daily Transmission Sweep (12:00 UTC)
    cron.schedule("0 12 * * *", async () => {
      client.guilds.cache.forEach(async (guild) => {
        const channel = guild.channels.cache.find(c => c.name === "general");
        if (!channel) return;
        await channel.send("📡 System Sweep — entropy nominal. Keep maintenance faith.");
      });
    });

    // ⚙️ Integrity Reading every 3 hours
    cron.schedule("0 */8 * * *", async () => {
      client.guilds.cache.forEach(async (guild) => {
        const channel = guild.channels.cache.find(c => c.name === "general");
        if (!channel) return;

        const integrity = Math.floor(65 + Math.random() * 35); // 65–100%
        const entropyLevels = ["low", "moderate", "high"];
        const entropy = entropyLevels[Math.floor(Math.random() * entropyLevels.length)];

        const embed = new EmbedBuilder()
          .setTitle("📶 Signal Integrity Report")
          .setDescription(`Integrity: **${integrity}%**\nEntropy: **${entropy}**`)
          .setColor(integrity < 75 ? 0xff4500 : 0x00ff99)
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      });
    });
  },
};
