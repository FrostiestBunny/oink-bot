//autopublish announcements from announcement channels
const { Events, ChannelType } = require('discord.js');

//announcement channel IDs
const announcementChannels = [
  '1247315856967598101',
  '1247663621975179375',
  '1247573120777191506',
  '1247573147205636117',
];

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      //check message exists, & in a valid channel
      if (!message || !message.guild) return;

      //check if the message is in an announcement channel that needs to be crossposted
      if (
        message.channel.type === ChannelType.GuildAnnouncement &&
        announcementChannels.includes(message.channel.id)
      ) {
        //crosspost the message
        setTimeout(async () => {
          try {
            if (message.crosspostable) {
              await message.crosspost();
            }
          } catch (error) {
            console.error(`Failed to crosspost message: ${error}`);
          }
        }, 3000); // 3s delay
      }
    } catch (error) {
      console.error('Error in autopublish event:', error);
    }
  },
};
