const Collection = require("../models/collection.model");

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({}, { _id: 0, __v: 0 });

    res.json({
      total: collections.length,
      collections,
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
  const appddress = req.params.address.toString();

  try {
    const collection = await Collection.findOne({
      contract_address: appddress,
    });

    res.json({
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while fetching the Collection.",
    });
    return;
  }
};
