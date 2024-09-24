//coinflip command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin for heads or tails')
  .addStringOption((option) =>
    option
      .setName('bet')
      .setDescription('Heads or Tails?')
      .setRequired(true)
      .addChoices({ name: 'heads', value: 'h' }, { name: 'tails', value: 't' })
  )
  .addIntegerOption((option) =>
    option
      .setName('quantity')
      .setDescription('Number of coins to flip (maximum 100)')
      .setRequired(false)
  );

//flip the coin
const execute = async (interaction) => {
  try {
    //set player name as username & choice as bet
    const playerName = interaction.member.displayName;
    const playerBet = interaction.options.getString('bet');
    const quantity = interaction.options.getInteger('quantity') || 1; //default 1

    //check for valid quantity
    if (quantity <= 0 || quantity > 100) {
      await interaction.reply(
        'Please enter a valid number of coins to flip between 1 and 100! <:nyaAngry:1251302942456414218>'
      );
      return;
    }

    //flip the coins & store results in array
    let results = [];
    let headsCount = 0;
    let tailsCount = 0;
    let wins = 0;
    for (let i = 0; i < quantity; i++) {
      const randomNum = Math.random();
      const result = randomNum < 0.5 ? 'Heads' : 'Tails';
      results.push(result);

      //tally results
      if (result === 'Heads') headsCount++;
      else tailsCount++;

      //check if bet won
      if (
        (playerBet === 'h' && result === 'Heads') ||
        (playerBet === 't' && result === 'Tails')
      ) {
        wins++;
      }
    }

    //plural check
    const coinMessage =
      quantity === 1 ? `flipped a coin` : `flipped **${quantity}** coins`;

    //result message
    let resultMessage;
    if (quantity === 1) {
      //win-loss for a single flip
      if (wins === 1) {
        resultMessage = `${playerName} **won**! <:nyaPog:1266689433755717752>`;
      } else {
        resultMessage = `${playerName} **lost**. <:nyaTBH:1255183972799877170>`;
      }
    } else {
      if (wins === quantity) {
        resultMessage = `Nyo way! **All** **__${quantity}__** flips matched ${playerName}'s bet! <:nyaGains:1286756910435143770>`;
      } else if (wins === 1) {
        resultMessage = `${playerName} won **__only once!__** <:nyaPaws:1259377908229738578>`;
      } else if (wins > 1) {
        resultMessage = `${playerName} won **${wins}** times! <:nyaPog:1266689433755717752>`;
      } else {
        resultMessage = `${playerName} **lost** **__all__** flips... Maybe this is a sign? <:nyaBinky:1260736866294956102>`;
      }
    }

    //make the embed with results
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('👛 Coin Flip Results 👛')
      .setThumbnail(interaction.member.displayAvatarURL())
      .setDescription(
        `${playerName} ${coinMessage} and bet **${
          playerBet === 'h' ? 'Heads' : 'Tails'
        }**.`
        //\n\n**Result**: ${results.join(', ')}\n\n${resultMessage}`
      )
      .addFields(
        {
          name: 'Flips <nyaFlipoff:1278021063195885609>',
          value: `• **Heads:** ${headsCount}\n• **Tails:** ${tailsCount}`,
          inline: true,
        },
        {
          name: 'Overall Results <:nYay2:1285207112116338718>',
          value: resultMessage,
          inline: false,
        }
      );

    //print results
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply(
      'Something went wrong while flipping... <:nyaSad:1250106743514599435>'
    );
  }
};

module.exports = { data, execute };
