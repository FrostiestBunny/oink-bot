require('dotenv').config();

const TOKEN = process.env.JWT_TOKEN;
const channelId = process.env.CHANNEL_ID;

const data = {
  users: [
    {
      username: 'frostierbunny',
      current: 200,
    },
  ],
  mode: 'add',
};

console.log(JSON.stringify(data));

const put_options = {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
  body: JSON.stringify(data),
};

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
};

const PUT_URL = `https://api.streamelements.com/kappa/v2/points/${channelId}`;
const URL = `https://api.streamelements.com/kappa/v2/points/${channelId}/top`;
// const URL = 'https://api.streamelements.com/kappa/v2/users/current';

fetch(PUT_URL, put_options)
  .then((response) => {
    console.log('Successfully added points');
    return response.text();
  })
  .then(async (response) => {
    console.log(response);

    const res = await fetch(URL, options);
    const text = await res.json();
    console.log(text);
  })
  .catch((err) => console.error(err));
