// coinflip command
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prompt = require('prompt-sync')({sigint: true});

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin for heads or tails');

//get & set player name as username (this should be discord integrated)
const playerName = prompt("Please enter your name:");
//get player bet, this also may be good as embedded buttons (they are cool) - maybe some gif flair or something too
const playerBet = prompt("Bet (h)eads or (t)ails?");

//flip the coin
const coinFlip = () => {
    const randomNum = Math.random();
    result = randomNum < 0.5 ? 'Heads' : 'Tails';

    //check result against bet
    if ((playerBet === 'h' && result === 'Heads') || (playerBet === 't' && result === 'Tails')) {
        console.log(`${playerName} bet ${playerBet === 'h' ? 'Heads' : 'Tails'} and won! The coin landed on ${result}.`);
    } else {
        console.log(`${playerName} bet ${playerBet === 'h' ? 'Heads' : 'Tails'} and lost. The coin landed on ${result}.`);
    }
    return result;
};

module.exports = { data, execute };
//run main method
coinFlip();