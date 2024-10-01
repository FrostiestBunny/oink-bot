//suggestion command
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//name of slash command & description
const data = new SlashCommandBuilder()
  .setName('suggestion')
  .setDescription('Send suggestions/feedback for Lorelei')
  .addStringOption((option) =>
    option
      .setName('category')
      .setDescription('The category of your suggestion')
      .setRequired(true)
      .addChoices(
        { name: 'General', value: 'general' },
        { name: 'Server', value: 'server' },
        { name: 'Twitch', value: 'twitch' },
        { name: 'YouTube', value: 'youtube' }
      )
  )
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The suggestion you want to send')
      .setRequired(true)
  )
  .addAttachmentOption((option) =>
    option
      .setName('attachment')
      .setDescription('Attach a file with your suggestion')
      .setRequired(false)
  );

//send the suggestion
const execute = async (interaction) => {
  try {
    //get the suggestion message, category, and attachment from the user
    const suggestion = interaction.options.getString('message');
    const category = interaction.options.getString('category');
    const attachment = interaction.options.getAttachment('attachment');
    //1283043121751658593 test
    //1281299794903433267 real
    //suggestions go to mod-alerts channel
    const suggestionChannel = interaction.client.channels.cache.get(
      '1283043121751658593'
    );

    //make an embed with the suggestion
    const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('📬 New Suggestion 📬')
      .setThumbnail(interaction.member.displayAvatarURL())
      .setDescription(
        `**From:** ${interaction.user.tag}\n**Category:** ${category}\n**Suggestion:**\n${suggestion}`
      )
      .setTimestamp();

    //send the suggestion, checks for attachment
    if (attachment) {
      await suggestionChannel.send({ embeds: [embed], files: [attachment] });
    } else {
      await suggestionChannel.send({ embeds: [embed] });
    }

    //reply to the user
    await interaction.reply({
      content:
        'Your suggestion has been sent successfully! <:nyaSalute:1251618350736478270>',
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        'Something went wrong while sending your suggestion. <:nyaSad:1250106743514599435>',
      ephemeral: true,
    });
  }
};

module.exports = { data, execute };
