// commands/choose-frequency.js
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("choose-frequency")
    .setDescription("Deploy the Frequency selection interface."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle("📡 Align with your Frequency")
      .setDescription(`
Each Frequency carries a function within the Rediscover Network.  
Choose wisely — the signal remembers.  
Only one Frequency may sync to your signal.

🟢 FREQ_47 — The Maintainers (Logic / Stability)  
🔵 FREQ_19 — The Translators (Emotion / Connection)  
🟣 FREQ_22 — The Resonant Veil (Reflection / Silence)  
🔴 FREQ_64 — The Forcebearers (Endurance / Strength)  
⚪ FREQ_71 — The Analysts (Precision / Insight)  
🟠 FREQ_88 — The Disruptors (Entropy / Evolution)
`);

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("FREQ_47").setLabel("FREQ_47").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("FREQ_19").setLabel("FREQ_19").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("FREQ_22").setLabel("FREQ_22").setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("FREQ_64").setLabel("FREQ_64").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("FREQ_71").setLabel("FREQ_71").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("FREQ_88").setLabel("FREQ_88").setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row1, row2] });
  }
};
