const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

exports.getCollectionRoyalty = async (address) => {
  try {
    const client = await SigningCosmWasmClient.connect(process.env.RPC_URL);
    const queryResult = await client.queryContractSmart(address, {
      nft_info: {
        token_id: "1"
      }
    });
    return queryResult.extension.royalty_percentage;
  } catch (error) {
    return undefined;
  }
};
