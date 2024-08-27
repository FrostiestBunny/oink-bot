require('dotenv').config();
const { SE_ENDPOINTS } = require('./se-endpoints');

const CHANNEL_ID = process.env.CHANNEL_ID;
let twitchNames = {};

const updateTwitchNames = (newTwitchNames) => {
  twitchNames = newTwitchNames;
};

const getTopPoints = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = SE_ENDPOINTS.POINTS + `${CHANNEL_ID}/top`;
  let response = await fetch(url, options);
  response = await response.json();
  return response;
};

const getUserPoints = async (username) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = SE_ENDPOINTS.POINTS + `${CHANNEL_ID}/${username}`;

  let response = await fetch(url, options);
  response = await response.json();
  return response;
};

const getTwitchUsername = (id) => {
  return twitchNames[id];
};

module.exports = {
  getTopPoints,
  getUserPoints,
  getTwitchUsername,
  updateTwitchNames,
};
