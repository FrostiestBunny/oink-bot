// blackjack game command
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prompt = require('prompt-sync')({sigint: true});

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('Play a game of blackjack');
//to test the slash command builder (& other discord integrations) I'd probably need to create a copy oinkbot

//get & set player name as username (this should be discord integrated)
const playerName = prompt("Please enter your name:");
//const playerName = interaction.options.getMember();
//should we be storing oinkbot's name? matters little but I'm referring to it multiple times
//may be something to look at if we get competitive, as in challenge eachother instead of playing against the bot only

//instantiate arrays
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

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
const blackJack = () => {
    //declare variables
    let deck = shuffleDeck(createDeck());
    let playerHand = [deck.pop(), deck.pop()];
    let oinkHand = [deck.pop(), deck.pop()];
    let playerStand = false;
    let gameOver = false;

    //repeat until game is over
    while (!gameOver) {
        //display hands, 1 of OinkBot's cards are hidden
        console.log(`${playerName}'s hand: ${handToString(playerHand)} (Value: ${handValue(playerHand)})`);
        console.log(`OinkBot's hand: ${handToString([oinkHand[0]])} and [Hidden]`);

        //check for blackjack
        if (handValue(playerHand) === 21) {
            console.log(`Blackjack! ${playerName} wins!`);
            gameOver = true;
            continue;
        }
        //this could maybe be done with embedded buttons like the extreme punish
        //this is also scuffed and I'm not sure how to test it here
        //hit or stand
        if (!playerStand) {
            let action = prompt("Do you want to (h)it or (s)tand?");
            //hit
            if (action === 'h') {
                playerHand.push(deck.pop());
                if (handValue(playerHand) > 21) {
                    console.log(`${playerName}'s hand: ${handToString(playerHand)} (Value: ${handValue(playerHand)})`);
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
            console.log(`OinkBot's hand: ${handToString(oinkHand)} (Value: ${handValue(oinkHand)})`);

            if (handValue(oinkHand) > 21) {
                console.log(`OinkBot busts! ${playerName} wins!`);
            } else if (handValue(oinkHand) >= handValue(playerHand)) {
                console.log("OinkBot wins!");
            } else {
                console.log(`${playerName} wins!`);
            }
            gameOver = true;
        }
    }
    //finish output
    console.log("Game over.");
};

//toString for displaying card hands
const handToString = (hand) => {
    return hand.map(card => `${card.value} of ${card.suit}`).join(', ');
};

module.exports = { data, execute };
//run main method
blackJack();
