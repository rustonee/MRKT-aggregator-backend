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

    collections = await Promise.all(
      collections.map(async collection => {
        const allCollectionsVolume = await calculateAllCollectionsVolume();
        const _24hPriceChange = await calculate24hVolumeChange(
          collection.contract_address
        );

        return {
          ...collection,
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
    const _24hPriceChange = await calculate24hVolumeChange(address);

    res.json({
      ...collection,
      _24hPriceChange,
      allCollectionsVolume
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

const calculate24hVolumeChange = async address => {
  const { data: allTimeVolume } = await axios.get(`${api_url}/volume`, {
    params: {
      period: "all",
      nft_address: address
    }
  });

  const currentVolume = allTimeVolume?.pop()?.volume || 0;
  const priviousVolume = allTimeVolume?.pop()?.volume || 0;

  const _24hPriceChange =
    ((currentVolume - priviousVolume) / currentVolume) * 100;

  return _24hPriceChange;
};
