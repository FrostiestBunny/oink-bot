// blackjack game command
//TODO Bunny to refactor for buttons & embed
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('Play a game of blackjack');

//instantiate arrays
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
  'Ace',
];

//create the deck
const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
};

//shuffle the deck
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

//get value of hand
const handValue = (hand) => {
  let value = 0;
  let aceCount = 0;
  for (let card of hand) {
    if (['Jack', 'Queen', 'King'].includes(card.value)) {
      value += 10;
    } else if (card.value === 'Ace') {
      aceCount++;
      value += 11;
    } else {
      value += parseInt(card.value);
    }
  }
  //converts ace value when over 21
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
};

//start the game
const execute = async (interaction) => {
  await interaction.reply('Game is starting right nyaow!');

  //declare variables
  let deck = shuffleDeck(createDeck());
  let playerHand = [deck.pop(), deck.pop()];
  let oinkHand = [deck.pop(), deck.pop()];
  let playerStand = false;
  let gameOver = false;
  const playerName = interaction.member.displayName;
  const dealerName = interaction.client.user.displayName;

  //buttons
  const btnHit = new ButtonBuilder()
    .setCustomId('hit')
    .setLabel('Hit')
    .setStyle(ButtonStyle.Secondary);

  const btnStand = new ButtonBuilder()
    .setCustomId('stand')
    .setLabel('Stand')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(btnHit, btnStand);

  //game embed
  let embed = new EmbedBuilder()
    .setColor('LuminousVividPink')
    .setTitle('Blackjack Table')
    .addFields({
      name: `${playerName}'s hand:`,
      value: `${handToString(playerHand)} (Value: ${handValue(playerHand)})`,
    })
    .addFields({
      name: `${dealerName}'s hand:`,
      value: `${handToString([oinkHand[0]])} and [Hidden]`,
    });

  //send embed of blackjack game
  const message = await interaction.channel.send({
    embeds: [embed],
    components: [row],
  });

  const filter = (i) =>
    i.customId === 'hit' ||
    (i.customId === 'stand' && i.user.id === interaction.member.id);

  //repeat until game is over
  while (!gameOver) {
    //display hands, 1 of OinkBot's cards are hidden
    embed = new EmbedBuilder()
      .setColor('LuminousVividPink')
      .setTitle('Blackjack Table')
      .addFields({
        name: `${playerName}'s hand:`,
        value: `${handToString(playerHand)} (Value: ${handValue(playerHand)})`,
      })
      .addFields({
        name: `${dealerName}'s hand:`,
        value: `${handToString([oinkHand[0]])} and [Hidden]`,
      });

    //check for blackjack
    if (handValue(playerHand) === 21) {
      await interaction.channel.send(`Blackjack! ${playerName} wins!`);
      gameOver = true;
      continue;
    }

    await message.edit({ embeds: [embed] });

    //hit or stand
    if (!playerStand) {
      let action = prompt('Do you want to (h)it or (s)tand?');
      //hit
      if (action === 'h') {
        playerHand.push(deck.pop());
        if (handValue(playerHand) > 21) {
          console.log(
            `${playerName}'s hand: ${handToString(
              playerHand
            )} (Value: ${handValue(playerHand)})`
          );
          console.log(`Bust! ${playerName} loses.`);
          gameOver = true;
        }
        //stand
      } else if (action === 's') {
        playerStand = true;
      }
    } else {
      //OinkBot hits on 16, stands on 17
      while (handValue(oinkHand) < 17) {
        oinkHand.push(deck.pop());
      }
      embed.fields[1] = {
        name: `${dealerName}'s hand:`,
        value: `${handToString(dealerHand)} (Value: ${handValue(dealerHand)})`,
      };
      await message.edit({ embeds: [embed] });

      if (handValue(oinkHand) > 21) {
        console.log(`${dealerName} busts! ${playerName} wins!`);
      } else if (handValue(oinkHand) >= handValue(playerHand)) {
        console.log(`${dealerName} wins!`);
      } else {
        console.log(`${playerName} wins!`);
      }
      gameOver = true;
    }
  }
  //finish output
  await interaction.followUp('Game over.');
};

//toString for displaying card hands
const handToString = (hand) => {
  return hand.map((card) => `${card.value} of ${card.suit}`).join(', ');
};

module.exports = { data, execute };
