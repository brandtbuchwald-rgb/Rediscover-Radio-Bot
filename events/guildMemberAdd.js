import { EmbedBuilder } from "discord.js";

export default {
  name: "guildMemberAdd",
  async execute({ args }) {
    const [member] = args;
    const channel = member.guild.channels.cache.find(c => c.name === "welcomer");
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x22ff77)
      .setTitle("📡 Incoming Transmission")
      .setDescription(
        `Signal handshake detected. Welcome, ${member}.\n\n` +
        "Maintenance is faith.\nBroken is honest.\nThe Noise is proof."
      )
      .setFooter({ text: "Frequency 47 // System Acknowledged" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    const role = member.guild.roles.cache.find(r => r.name === "Frequency Initiate");
    if (role) await member.roles.add(role);
  }
};
