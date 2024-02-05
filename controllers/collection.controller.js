const { default: axios } = require("axios");
const Collection = require("../models/collection.model");
const {
  calculateAllCollectionsVolume
} = require("./services/calculateAllCollectionsVolume");
const {
  calculatePriceChangeAndSaleCount
} = require("./services/calculatePriceChangeAndSaleCount");
const { getCollectionRoyalty } = require("./services/getCollectionRoyalty");
const { fetchCollection } = require("./services/fetchCollection");

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
    let collection;

    try {
      collection = await fetchCollection(address);
    } catch (error) {
      const collectionFromDb = await Collection.findOne({
        contract_address: address
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
