const { default: axios } = require("axios");
const Collection = require("../models/collection.model");

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

    let collections = await Collection.find(query, { _id: 0, __v: 0 })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const allCollectionsVolume = await calculateAllCollectionsVolume();

    collections = await Promise.all(
      collections.map(async collection => {
        const saleCount = await fetchCollectionSaleCount(
          collection.contract_address
        );
        const _24hPriceChange = await calculatePriceChange(
          collection.contract_address
        );
        return {
          ...collection._doc,
          saleCount,
          allCollectionsVolume,
          _24hPriceChange
        };
      })
    );

    res.json({
      total: totalCounts,
      collections
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
    const api_url = process.env.API_URL;

    const { data: collection } = await axios.get(`${api_url}/nfts/${address}`, {
      params: {
        get_tokens: "false"
      }
    });

    const allCollectionsVolume = await calculateAllCollectionsVolume();
    const saleCount = await fetchCollectionSaleCount(address);
    const _24hPriceChange = await calculatePriceChange(address);

    res.json({
      ...collection,
      saleCount,
      allCollectionsVolume,
      _24hPriceChange
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collection."
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

const calculatePriceChange = async address => {
  const collection = await fetchCollection(address);
  const collectionFromdb = await Collection.findOne({
    contract_address: address
  });

  const currentPrice = collection.floor || 0;
  const previousPrice = collectionFromdb.floor || 0;

  return (currentPrice - previousPrice) / currentPrice;
};

const fetchCollectionSaleCount = async address => {
  const { data } = await axios.get(
    `https://api.prod.pallet.exchange/api/v2/nfts/${address}/details`
  );

  return data?.num_sales_24hr;
};

const fetchCollection = async address => {
  const api_url = process.env.API_URL;

  const { data: collection } = await axios.get(`${api_url}/nfts/${address}`, {
    params: {
      get_tokens: "false"
    }
  });

  return collection;
};
