const { default: axios } = require("axios");
const Collection = require("../models/collection.model");
const {
  calculateAllCollectionsVolume,
} = require("./services/calculateAllCollectionsVolume");
const {
  calculatePriceChangeAndSaleCount,
} = require("./services/calculatePriceChangeAndSaleCount");
const { getCollectionRoyalty } = require("./services/getCollectionRoyalty");
const { fetchCollection } = require("./services/fetchCollection");
const { fetchCollectionDetails } = require("./services/fetchCollectionDetails");
const { getListedNftsFromMrktContract } = require("./mrkt/get-listed-nfts");
const { getNftMetadata } = require("./mrkt/get-nft-metadata");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

exports.createCollection = async (req, res) => {
  const address = req.body.address;

  try {
    if (!address) {
      res.status(400).send({ message: "Collection address is required" });
      return;
    }
    const collection = await fetchCollection(address);
    collection.floor_24hr = collection.floor;
    collection.royalty = await getCollectionRoyalty(address);

    const newCollection = new Collection(collection);
    await newCollection.save();

    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving the collection.",
    });
    return;
  }
};

exports.getCollections = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.page_size) || 25;
  const name = req.query.name || undefined;
  const lookback = req.query.sort_by_lookback || "24hr";

  try {
    let query = { chain_id: "pacific-1", [`volume_${lookback}`]: { $gt: 0 } };
    const sort = { [`volume_${lookback}`]: -1 };

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    const totalCounts = await Collection.countDocuments(query);

    const collections = await Collection.find(query, {
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
      [`num_sales_${lookback}`]: 1,
      volume: 1,
      [`volume_${lookback}`]: 1,
      royalty: 1,
    })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const allCollectionsVolume = await calculateAllCollectionsVolume();

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
        })
      );

      colltionsWithPrice.push(...data);
    }

    res.json({
      total: totalCounts,
      collections: colltionsWithPrice,
      allCollectionsVolume,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collections.",
    });
    return;
  }
};

exports.getCollection = async (req, res) => {
  try {
    const address = req.params.address;
    let collection;

    try {
      collection = await fetchCollectionDetails(address);
    } catch (error) {
      const collectionFromDb = await Collection.findOne({
        contract_address: address,
      });
      collection = collectionFromDb._doc;
    }

    const allCollectionsVolume = await calculateAllCollectionsVolume();

    const listed = (collection.auction_count / collection.supply) * 100;

    const { _24hFloorChange, _24hVolumeChange, saleCount } =
      await calculatePriceChangeAndSaleCount(collection.contract_address);

    const royalty = await getCollectionRoyalty(address);

    res.json({
      ...collection,
      royalty,
      allCollectionsVolume,
      saleCount,
      _24hFloorChange,
      _24hVolumeChange,
      listed,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collection.",
    });
    return;
  }
};

exports.getCollectionTraits = async (req, res) => {
  try {
    const address = req.params.address;
    const api_url = process.env.BASE_API_URL;
    const { data } = await axios.get(`${api_url}/v2/nfts/${address}/traits`);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message:
        err.message || "Error occurred while fetching the Collection traits.",
    });
    return;
  }
};

exports.getCollectionActivities = async (req, res) => {
  try {
    const api_url = process.env.BASE_API_URL;

    const address = req.params.address;

    const page = req.query.page || 1;
    const pageSize = req.query.page_size || 25;

    const typeMapping = {
      sale: "sale",
      list: `list%5C_`,
      withdraw_listing: "withdraw_listing",
    };

    const type = typeMapping[req.query.type] || "";

    const { data } = await axios.get(
      `${api_url}/v1/marketplace/activities?event_type=${type}`,
      {
        params: {
          chain_id: "pacific-1",
          nft_address: address,
          page,
          pageSize,
        },
      }
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message:
        err.message ||
        "Error occurred while fetching the Collection activities.",
    });
    return;
  }
};

exports.getListedNftOnMrktCollection = async (req, res) => {
  try {
    const address = req.params.address;

    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.page_size || 25);

    const client = await SigningCosmWasmClient.connect(process.env.RPC_URL);

    const allListedNftsOnCollection = await getListedNftsFromMrktContract(
      client
    ).then((list) => list.filter((nft) => nft.cw721_address === address));

    const total = allListedNftsOnCollection.length;

    const nfts = await Promise.all(
      allListedNftsOnCollection
        .slice((page - 1) * pageSize, page * pageSize)
        .map(async (nft) => {
          const metadata = await getNftMetadata(
            client,
            nft.cw721_address,
            nft.token_id
          );

          return {
            ...metadata,
            listed: nft,
          };
        })
    );

    res.json({
      nfts,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Error occurred while fetching the mrkt nfts",
    });
    return;
  }
};
