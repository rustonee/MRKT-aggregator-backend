const fs = require("fs");
const { default: axios } = require("axios");
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
      message:
        err.message || "Some error occurred while fetching the Collections.",
    });
    return;
  }
};

exports.getCollection = async (req, res) => {
  const contractAddress = req.params.address.toString();

  try {
    const collections = readJSONFromFile("collections");
    const collection = collections.find(
      (collection) => collection.contract_address === contractAddress
    );

    res.json({
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while fetching the Collection.",
    });
    return;
  }
};

// Read JSON object from a file
const readJSONFromFile = (filename) => {
  try {
    const directoryPath = __basedir + "/assets/";
    const collectionsData = fs.readFileSync(directoryPath + filename, "utf8");
    return JSON.parse(collectionsData);
  } catch (err) {
    console.log(`Error readJSONFromFile => ${filename} : " ${err.message}`);
    return null;
  }
};
