const axios = require("axios");
const { retryDecorator } = require("ts-retry-promise");

exports.fetchUserNftsFromPallet = retryDecorator(
  (walletAddress, params) =>
    axios
      .get(`${process.env.API_URL}/user/${walletAddress}`, { params })
      .then((response) => response.data),
  { delay: 200, retries: 6 }
);
