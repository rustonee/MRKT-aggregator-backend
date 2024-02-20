const { fetchUserNftsFromPallet } = require("./services/fetchUserNfts");
const {
  fetchUserActivitiesFromPallet,
} = require("./services/fetchUserActivities");
const {
  calculatePriceChangeAndSaleCount,
} = require("./services/calculatePriceChangeAndSaleCount");
const Collection = require("../models/collection.model");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const {
  getListSalesFromMrktContract,
} = require("./services/getListSalesFromMrktContract");

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
    const status = req.query.status || "all"; // "all" | "listed" || owned
    const marketplace = req.query.marketplace; // "all" | "MRKT" | "Other" // avaiable only status = listed

    if (!walletAddress) {
      res.status(400).send({ message: "Wallet address is required" });
      return;
    }

    const params = {
      include_tokens: true,
      include_bids: true,
      fetch_nfts: true,
    };

    let ownedNfts =
      (await fetchUserNftsFromPallet(walletAddress, params)).nfts || [];

    const client = await SigningCosmWasmClient.connect(process.env.RPC_URL);

    const listSalesFromMrkt =
      (await getListSalesFromMrktContract(client)).list || [];

    const allNftsListedOnMrkt =
      (await fetchUserNftsFromPallet(process.env.MRKT_CONTRACT, params)).nfts ||
      [];

    let allNfts = [...ownedNfts, ...allNftsListedOnMrkt];

    allNfts = await Promise.all(
      [...ownedNfts, ...allNftsListedOnMrkt].map((nft) => {
        if (!!nft.auction) {
          nft.marketplace = "Pallet";
        }

        const sale = listSalesFromMrkt.find(
          (sale) =>
            sale.token_id === nft.id &&
            sale.cw721_address === nft.collection.contract_address,
        );

        if (sale) {
          nft.marketplace = "MRKT";
          nft.listing = sale;
        }

        return nft;
      }),
    );

    if (status === "owned") {
      allNfts = allNfts.filter((nft) => !nft.auction && !nft.listing);
    } else if (status === "listed") {
      if (marketplace === "MRKT") {
        allNfts = allNfts.filter((nft) => nft.marketplace === "MRKT");
      } else if (marketplace === "Other") {
        allNfts = allNfts.filter((nft) => nft.marketplace === "Pallet");
      } else {
        allNfts = allNfts.filter((nft) => !!nft.auction || !!nft.listing);
      }
    }

    res.json({
      address: walletAddress,
      nfts: allNfts,
    });
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
