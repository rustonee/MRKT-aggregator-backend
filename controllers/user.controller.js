const { fetchUserNftsFromPallet } = require("./services/fetchUserNfts");
const {
  fetchUserActivitiesFromPallet,
} = require("./services/fetchUserActivities");
const {
  calculatePriceChangeAndSaleCount,
} = require("./services/calculatePriceChangeAndSaleCount");
const Collection = require("../models/collection.model");
// const { getListedNftsFromMrktContract } = require("./mrkt/get-listed-nfts");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { getNftMetadata } = require("./mrkt/get-nft-metadata");

exports.getUserCollections = async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    if (!walletAddress) {
      res.status(400).send({ message: "Wallet address is required" });
      return;
    }

    const params = {
      include_tokens: true,
      include_bids: true,
      fetch_nfts: true,
    };

    const data = await fetchUserNftsFromPallet(walletAddress, params);

    // Extract unique contract_address values
    const uniqueContractAddresses = new Set(
      data.nfts.map((nft) => nft.collection.contract_address),
    );

    // Convert Set to an array
    const contract_addresses = Array.from(uniqueContractAddresses);

    const collections = await Collection.find(
      {
        contract_address: { $in: contract_addresses },
      },
      {
        _id: 0,
        contract_address: 1,
        name: 1,
        slug: 1,
        pfp: 1,
        supply: 1,
        owners: 1,
        auction_count: 1,
        floor: 1,
        floor_24hr: 1,
        num_sales: 1,
        // [`num_sales_${lookback}`]: 1,
        volume: 1,
        // [`volume_${lookback}`]: 1,
        royalty: 1,
      },
    );

    const colltionsWithPrice = [];

    for (let idx = 0; idx < collections.length; idx += 20) {
      const data = await Promise.all(
        collections.slice(idx, idx + 20).map(async (collection) => {
          const listed = (collection.auction_count / collection.supply) * 100;
          const { _24hFloorChange, _24hVolumeChange, saleCount } =
            await calculatePriceChangeAndSaleCount(collection.contract_address);

          return {
            ...collection._doc,
            saleCount,
            _24hFloorChange,
            _24hVolumeChange,
            listed,
          };
        }),
      );

      colltionsWithPrice.push(...data);
    }

    res.json({
      total: colltionsWithPrice.length,
      collections: colltionsWithPrice,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while fetching the owned NFTs.",
    });
    return;
  }
};

exports.getUserNfts = async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    if (!walletAddress) {
      res.status(400).send({ message: "Wallet address is required" });
      return;
    }

    const params = {
      include_tokens: true,
      include_bids: true,
      fetch_nfts: true,
    };

    const data = await fetchUserNftsFromPallet(walletAddress, params);

    res.json(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while fetching the owned NFTs.",
    });
    return;
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const eventMapping = {
      sale: "sale",
      list: `list%5C_`,
      withdraw_listing: "withdraw_listing",
    };
    const event = eventMapping[req.query.event] || "";

    const page = req.query.page;
    const pageSize = req.query.page_size;

    const params = {
      chain_id: "pacific-1",
      page,
      page_size: pageSize,
    };

    const data = await fetchUserActivitiesFromPallet(
      walletAddress,
      event,
      params,
    );

    res.json(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while fetching the nft activities.",
    });

    return;
  }
};

// exports.getListedNftFromMrktMarketByUser = async (req, res) => {
//   try {
//     const walletAddress = req.params.walletAddress;

//     if (!walletAddress) {
//       res.status(400).send({ message: "Wallet address is required" });
//       return;
//     }

//     const client = await SigningCosmWasmClient.connect(process.env.RPC_URL);

//     const listedOnMrktMarketByUser = await getListedNftsFromMrktContract(
//       client,
//     ).then((list) => list.filter((sale) => sale.provider === walletAddress));

//     const nfts = await Promise.all(
//       listedOnMrktMarketByUser.map(async (nft) => {
//         try {
//           const metadata = await getNftMetadata(
//             client,
//             nft.cw721_address,
//             nft.token_id,
//           );
  
//           return {
//             ...metadata,
//             listing: nft,
//           };
//         } catch (err) {
//           // TODO - should handle collection info if metadata failed
//           return {
//             listing: nft,
//           };
//         }
//       }),
//     );

//     res.json({ address: walletAddress, nfts });
//   } catch (error) {
//     res.status(500).send({
//       message:
//         error.message ||
//         "Some error occurred while fetching the listed nft on mrkt marketplace.",
//     });

//     return;
//   }
// };
