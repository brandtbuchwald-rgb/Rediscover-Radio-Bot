const KEYWORDS = ["noise", "faith", "broken", "maintenance"];
const BLOOMS = [
  "🟢 Signal spike detected.",
  "⚡ The static answers.",
  "🔧 Maintenance is faith.",
  "📡 Frequency distortion registered."
];
const bloomCooldown = new Set();
const breachCooldown = new Set();

export default {
  name: "messageCreate",
  async execute({ args }) {
    const [msg] = args;
    if (!msg || msg.author.bot) return;

    const lower = msg.content.toLowerCase();

    // 🌿 Static Bloom event (keywords)
    const bloomKey = `bloom:${msg.channel.id}`;
    if (!bloomCooldown.has(bloomKey) && KEYWORDS.some(k => lower.includes(k))) {
      bloomCooldown.add(bloomKey);
      setTimeout(() => bloomCooldown.delete(bloomKey), 30_000);
      await msg.reply(BLOOMS[Math.floor(Math.random() * BLOOMS.length)]);
    }

    // 🧨 Noise Containment (mini-event)
    const breachKey = `breach:${msg.channel.id}`;
    if (!breachCooldown.has(breachKey) && Math.random() < 0.1) {
      breachCooldown.add(breachKey);
      setTimeout(() => breachCooldown.delete(breachKey), 600_000);

      const alert = await msg.channel.send("⚠️ **Noise Breach Detected!** Type `!contain` within 20s to stabilize.");
      let contained = false;

      const collector = msg.channel.createMessageCollector({ time: 20_000 });
      collector.on("collect", m => {
        if (!m.author.bot && m.content.trim().toLowerCase() === "!contain") contained = true;
      });
      collector.on("end", () => {
        alert.reply(contained ? "✅ Signal stabilized." : "💀 The Noise spreads.");
      });
    }
  }
};
