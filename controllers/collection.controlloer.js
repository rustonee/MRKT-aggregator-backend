const { default: axios } = require("axios");
const Collection = require("../models/collection.model");
const CollectionMonitor = require("../models/collection-monitor.model");


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
        collections.slice(idx, idx + 20).map(async collection => {
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

      colltionsWithPrice.push(...data);
    }

    res.json({
      total: totalCounts,
      collections: colltionsWithPrice
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
    const saleCount = await fetchCollectionSaleCount(address);
    const _24hPriceChange = await calculatePriceChange(address);

    res.json({
      ...collection._doc,
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
    try {
      const collection = await fetchCollection(address);

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const monitor = await CollectionMonitor.findOne({date: {$lte: oneDayAgo} , contract_address: address }).sort({ date: -1 });
      
      const currentPrice = collection.floor;
      const previousPrice = monitor.floor;

      if(currentPrice && previousPrice) {
        return (currentPrice- previousPrice )  / currentPrice
      }

      return undefined;
    } catch (error) {
      return undefined;
    }
};

const fetchCollectionSaleCount = async address => {
  const api_url = process.env.BASE_API_URL;
  try {
    const { data } = await axios.get(`${api_url}/v2/nfts/${address}/details`);

    return data?.num_sales_24hr;
  } catch {
    return undefined;
  }
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
