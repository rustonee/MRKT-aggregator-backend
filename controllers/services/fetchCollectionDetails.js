const axios = require("axios");

exports.fetchCollectionDetails = async (address) => {
  try {
    const api_url = process.env.BASE_API_URL;
    const { data } = await axios.get(`${api_url}/v2/nfts/${address}/details`);

    return data;
  } catch (err) {}

  return null;
};
