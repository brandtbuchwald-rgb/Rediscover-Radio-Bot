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

    // Channel IDs
    const broadcastChannelId = "YOUR_SIGNAL_INTEGRITY_CHANNEL_ID"; // Replace with your ID
    const ignoredChannels = ["OTHER_CHANNEL_ID_1", "OTHER_CHANNEL_ID_2"]; // Optional

    // 🕛 Daily Transmission Sweep (12:00 UTC)
    cron.schedule("0 12 * * *", async () => {
      client.guilds.cache.forEach(async (guild) => {
        const channel = guild.channels.cache.get(broadcastChannelId);1433056563798736926
        if (!channel || ignoredChannels.includes(channel.id)) return;1431646658143457390

        await channel.send("📡 System Sweep — entropy nominal. Keep maintenance faith.");
      });
    });

    // ⚙️ Integrity Reading every 8 hours
    cron.schedule("0 */8 * * *", async () => {
      client.guilds.cache.forEach(async (guild) => {
        const channel = guild.channels.cache.get(broadcastChannelId);
        if (!channel || ignoredChannels.includes(channel.id)) return;

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
