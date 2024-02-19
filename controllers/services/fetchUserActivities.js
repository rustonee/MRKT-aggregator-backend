const axios = require("axios");
const { retryDecorator } = require("ts-retry-promise");

exports.fetchUserActivitiesFromPallet = retryDecorator(
  (walletAddress, event, params) =>
    axios
      .get(
        `${process.env.API_URL}/marketplace/activities?user=${walletAddress}&event_type=${event}`,
        { params }
      )
      .then((response) => response.data),
  { delay: 200, retries: 6 }
);
