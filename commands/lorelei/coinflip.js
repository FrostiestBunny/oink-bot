// coinflip command
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("Flip a coin for heads or tails")
  .addStringOption((option) =>
    option
      .setName("bet")
      .setDescription("Heads or Tails?")
      .setRequired(true)
      .addChoices({ name: "heads", value: "h" }, { name: "tails", value: "t" })
  );

//flip the coin
const execute = async (interaction) => {
  //set playername as username & choice as playerbet
  const playerName = interaction.member.displayName;
  const playerBet = interaction.options.getString("bet");
  //logic to determine if heads or tails
  const randomNum = Math.random();
  result = randomNum < 0.5 ? "Heads" : "Tails";

  //check result against bet
  if (
    (playerBet === "h" && result === "Heads") ||
    (playerBet === "t" && result === "Tails")
  ) {
    await interaction.reply(
      `${playerName} bet ${
        playerBet === "h" ? "Heads" : "Tails"
      } and won! The coin landed on ${result}.`
    );
  } else {
    await interaction.reply(
      `${playerName} bet ${
        playerBet === "h" ? "Heads" : "Tails"
      } and lost. The coin landed on ${result}.`
    );
  }
};

module.exports = { data, execute };
