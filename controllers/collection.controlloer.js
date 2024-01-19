const fs = require("fs");
const { default: axios } = require("axios");

exports.getCollections = async (req, res) => {
  try {
    let collections = readJSONFromFile("collections");
    if (!collections) {
      const api_url = process.env.API_URL;
      const result = await axios.get(`${api_url}/nfts?get_tokens=false`);

      if (!result.data) {
        next(JSON.stringify({ success: false, message: "Can not fetch." }));
      } else {
        if (result.data.nfts) {
          const page1 = result.data.nfts.pages["1"];
          const page2 = result.data.nfts.pages["2"];
          collections = page1.concat(page2);

          const directoryPath = __basedir + "/assets/";
          if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
          }

          fs.writeFileSync(
            directoryPath + "collections",
            JSON.stringify(collections)
          );
        } else {
          res.send({
            message: "No found collections!",
          });
        }
      }
    }

    res.json({
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
