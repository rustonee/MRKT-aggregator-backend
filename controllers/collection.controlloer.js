const { default: axios } = require("axios");
const Collection = require("../models/collection.model");
const CollectionMonitor = require("../models/collection-monitor.model");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

exports.getCollections = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.page_size) || 25;
  const name = req.query.name || undefined;

  try {
    let query = { chain_id: "pacific-1" };
    const sort = { volume_24hr: -1 };

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    const totalCounts = await Collection.countDocuments(query);
    const totalPages = Math.ceil(totalCounts / limit);

    const collections = await Collection.find(query, { _id: 0, __v: 0 })
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
            listed
          };
        })
      );

      colltionsWithPrice.push(...data);
    }

    res.json({
      total: totalCounts,
      collections: colltionsWithPrice,
      allCollectionsVolume
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collections."
    });
    return;
  }
};

exports.getCollection = async (req, res) => {
  try {
    const address = req.params.address;

    const collection = await Collection.findOne({
      contract_address: address
    });

    const allCollectionsVolume = await calculateAllCollectionsVolume();
    const listed = (collection.auction_count / collection.supply) * 100;
    const { _24hFloorChange, _24hVolumeChange, saleCount } =
      await calculatePriceChangeAndSaleCount(collection.contract_address);

    const royalty = await getCollectionRoyalty(address);

    res.json({
      ...collection._doc,
      royalty,
      allCollectionsVolume,
      saleCount,
      _24hFloorChange,
      _24hVolumeChange,
      listed
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collection."
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
        err.message || "Error occurred while fetching the Collection traits."
    });
    return;
  }
};

const calculateAllCollectionsVolume = async () => {
  const [{ allCollectionsVolume }] = await Collection.aggregate([
    {
      $group: {
        _id: null,
        allCollectionsVolume: {
          $sum: "$volume"
        }
      }
    }
  ]);

  return allCollectionsVolume;
};

const calculatePriceChangeAndSaleCount = async (address) => {
  try {
    const currentCollection = await CollectionMonitor.findOne({
      contract_address: address
    }).sort({ date: -1 });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const previousCollection = await CollectionMonitor.findOne({
      date: { $lte: oneDayAgo },
      contract_address: address
    }).sort({ date: -1 });

    const currentFloor = currentCollection.floor;
    const previousFloor = previousCollection.floor;

    const current24hVolume = currentCollection.volume_24hr;
    const previous24hVolume = previousCollection.volume_24hr;

    return {
      _24hFloorChange: (currentFloor - previousFloor) / currentFloor,
      _24hVolumeChange:
        (current24hVolume - previous24hVolume) / current24hVolume,
      saleCount: currentCollection.sale_count
    };
  } catch (error) {
    return {};
  }
};

const getCollectionRoyalty = async (address) => {
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
