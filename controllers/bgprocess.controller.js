const fs = require("fs");
const axios = require("axios");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // in milliseconds

exports.fetchCollections = async (req, res) => {
  try {
    const api_url = process.env.API_URL;
    const result = await axios.get(`${api_url}/nfts?get_tokens=false`);

    if (!result.data) {
      next(JSON.stringify({ success: false, message: "Can not fetch." }));
    } else {
      if (result.data.nfts) {
        const page1 = result.data.nfts.pages["1"];
        const page2 = result.data.nfts.pages["2"];
        let collections = page1.concat(page2);

        const directoryPath = __basedir + "/assets/";
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath);
        }

        fs.writeFileSync(
          directoryPath + "collections",
          JSON.stringify(collections)
        );

        res.send({
          message: "Collection stored Successfully!",
        });
      } else {
        res.send({
          message: "No found collections!",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Collection.",
    });
    return;
  }
};

exports.fetchNfts = async (req, res) => {
  const collections = readJSONFromFile("collections");
  for (const collection of collections) {
    const countOfNfts = await getCountOfNftsFromContract(
      collection.contract_address
    );

    console.log(collection.contract_address, countOfNfts);

    await saveNfts(collection.contract_address, countOfNfts);
  }
};

const saveNfts = async (collectionAddress, count) => {
  let nfts = [];
  for (let tokenId = 0; tokenId < count; tokenId++) {
    const nft = await getNftFromContract(collectionAddress, tokenId);
    // console.log(`tokenId: ${tokenId} => `, nft);
    if (nft && nft.status === "active_auction") {
      nfts.push(nft);
    }
  }

  const directoryPath = __basedir + "/assets/nfts";
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  fs.writeFileSync(
    directoryPath + "/" + collectionAddress,
    JSON.stringify(nfts)
  );
};

const getCountOfNftsFromContract = async (contractAddress) => {
  try {
    const queryMsg = `{
      "num_tokens": {}
    }`;

    const { count } = await queryContract(contractAddress, queryMsg);

    return count;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

const getNftFromContract = async (collectionAddress, tokenId) => {
  try {
    const queryMsg = `{
      "nft": {
        "address": "${collectionAddress}",
        "token_id": "${tokenId}"
      }
    }`;

    let nft = await queryContract(process.env.SEI_CONTROLLER_ADDRESS, queryMsg);

    const metadata = await getMetadataOfNftFromContract(
      collectionAddress,
      tokenId
    );

    nft.metadata = metadata;

    console.log("nft: ", nft);

    return nft;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getMetadataOfNftFromContract = async (collectionAddress, tokenId) => {
  try {
    const queryMsg = `{
      "nft_info": {
        "token_id": "${tokenId}"
      }
    }`;

    const nftInfo = await queryContract(collectionAddress, queryMsg);
    if (nftInfo && nftInfo.token_uri) {
      // console.log("metadata uri: ", nftInfo);

      const result = await axios.get(nftInfo.token_uri, { maxRedirects: 5 });

      return result.data;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};

const queryContract = async (contractAddress, queryMsg, retryCount = 0) => {
  try {
    await delay(300);

    const client = await SigningCosmWasmClient.connect(process.env.RPC_URL);
    const queryResult = await client.queryContractSmart(
      contractAddress,
      JSON.parse(queryMsg)
    );

    // console.log(queryResult);

    return queryResult;
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const delayTime = Math.pow(2, retryCount) * RETRY_DELAY;
      console.log(`Retrying after ${delayTime} ms`);
      await delay(delayTime);
      return queryContract(contractAddress, queryMsg, retryCount + 1);
    } else {
      throw new Error("Max retry attempts reached");
    }
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

exports.fetchMetadata = async (req, res) => {
  try {
    const url =
      "https://arweave.net/DKOBH7mOBBmqT7clT7lck-egEWSleybJHtTj6NOnhvM/0";
    const result = await axios.get(url);
    console.log(result.data);
  } catch (err) {
    console.log("error", err);
  }

  res.send({
    message: "NFTs stored Successfully!",
  });
};
