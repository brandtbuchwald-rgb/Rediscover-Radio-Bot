import cron from "node-cron";

export default {
  name: "ready",
  once: true,
  async execute({ client }) {
    console.log("Frequency 47: Chamber online.");
    client.user.setPresence({
      activities: [{ name: "Signal Integrity" }],
      status: "online"
    });

    // 🕐 Daily Transmission Sweep (12:00 UTC)
    cron.schedule("0 12 * * *", () => {
      client.guilds.cache.forEach(guild => {
        const channel = guild.channels.cache.find(c => c.name === "general");
        if (channel) channel.send("📡 System Sweep — entropy nominal. Keep maintenance faith.");
      });
    });

    // ⚙️ Integrity Reading every 3 hours
    setInterval(() => {
      client.guilds.cache.forEach(guild => {
        const channel = guild.channels.cache.find(c => c.name === "general");
        if (!channel) return;
        const integrity = Math.floor(65 + Math.random() * 35);
        const entropy = ["low", "moderate", "high"][Math.floor(Math.random() * 3)];
        channel.send(`[Integrity: ${integrity}% — entropy ${entropy}]`);
      });
    }, 1000 * 60 * 60 * 3);
  }
};
