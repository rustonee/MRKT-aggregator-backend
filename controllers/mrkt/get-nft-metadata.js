const axios = require("axios");
const { retryDecorator } = require("ts-retry-promise");

exports.getNftMetadata = retryDecorator(
  async (client, address, tokenId) => {
    const nftInfo = await client.queryContractSmart(address, {
      nft_info: {
        token_id: tokenId,
      },
    });

    const response = await axios(nftInfo.token_uri);

    return response.data;
  },
  { delay: 200, retries: 6 },
);
