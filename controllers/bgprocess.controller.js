const fs = require("fs");
const axios = require("axios");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const mongoose = require("mongoose");
const Collection = require("../models/collection.model");
const Nft = require("../models/nft.model");

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // in milliseconds

/*
exports.fetchCollections = async () => {
  try {
    const api_url = process.env.API_URL;
    const result = await axios.get(`${api_url}/nfts?get_tokens=false`);

    if (!result.data) {
      next(JSON.stringify({ success: false, message: "Can not fetch." }));
    } else {
      if (result.data.nfts) {
        let collections = [];
        const total = result.data.nfts.total;
        const pageSize = result.data.nfts.page_size;
        const count = Math.ceil(total / pageSize);
        for (let idx = 1; idx <= count; idx++) {
          const page = result.data.nfts.pages[`${idx}`];
          collections = collections.concat(page);
        }

        await saveCollections(collections);

        console.log("Collection stored Successfully.");
      } else {
        console.log("No found collections.");
      }
    }
  } catch (err) {
    console.log("Some error occurred while saving the Collections.", err);
  }
};
*/

exports.fetchCollections = async () => {
  try {
    let collections = await Collection.find();
    if (collections.length === 0) {
      collections = readCollectionsFromFile("collections");
    }

    let newCollections = [];
    for (let idx = 0; idx < collections.length; idx++) {
      const collection = collections[idx];

      const address = collection.contract_address;
      const collectionDetails = await fetchCollection(address);
      collectionDetails.floor_24hr = collectionDetails.floor;

      if (collection.pfp === "") {
        const pfp = await getPfp(collectionDetails.slug, address);
        collectionDetails.pfp = pfp;
      } else {
        collectionDetails.pfp = collection.pfp;
      }

      newCollections.push(collectionDetails);

      await delay(300);
      console.log(idx + " : " + collectionDetails);
    }

    await saveCollections(newCollections);

    console.log("Collection stored Successfully.");
  } catch (err) {
    console.log("Some error occurred while saving the Collections.", err);
  }
};

exports.fetchNfts = async () => {
  const collections = await Collection.find();
  for (const collection of collections) {
    const countOfNfts = await getCountOfNftsFromContract(
      collection.contract_address
    );

    console.log(collection.contract_address, countOfNfts);

    await saveNfts(collection.contract_address, countOfNfts);
  }
};

const saveCollections = async (collections) => {
  try {
    const bulkOperations = collections.map((collection) => {
      const { contract_address } = collection;

      return {
        updateOne: {
          filter: { contract_address },
          // update: collection,
          update: { $set: collection },
          upsert: true,
        },
      };
    });

    const CollectionModel = mongoose.model("collections", Collection.schema);

    // Perform the bulk write operation
    await CollectionModel.bulkWrite(bulkOperations);
  } catch (error) {
    console.error("Error saving collections: ", error);
  }
};

const saveNfts = async (collectionAddress, count) => {
  let nfts = [];
  for (let tokenId = 0; tokenId < count; tokenId++) {
    const nft = await getNftFromContract(collectionAddress, tokenId);
    if (nft) {
      nfts.push(nft);
    }
  }

  try {
    const bulkOperations = nfts.map((nft) => {
      const { key } = nft;

      return {
        updateOne: {
          filter: { key },
          update: { $set: nft },
          upsert: true,
        },
      };
    });

    const NftModel = mongoose.model("nfts", Nft.schema);

    // Perform the bulk write operation
    await NftModel.bulkWrite(bulkOperations);
  } catch (error) {
    console.error("Error saving nfts: ", error);
  }
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

    const nftInfo = await queryContract(
      process.env.SEI_CONTROLLER_ADDRESS,
      queryMsg
    );

    if (!nftInfo) {
      return null;
    }

    const metadata = await getMetadataOfNftFromContract(
      collectionAddress,
      tokenId
    );

    const nft = {
      key: `${nftInfo.nft_address}-${nftInfo.nft_token_id}`,
      id: nftInfo.nft_token_id,
      id_int: parseInt(nftInfo.nft_token_id),
      name: metadata?.name || nftInfo.nft_info.name,
      description: metadata?.description || nftInfo.nft_info.description,
      owner: nftInfo.owner,
      status: nftInfo.status,
      verified: nftInfo.verified,
      image: metadata?.image || "",
      last_sale: {},
      collection_key: nftInfo.nft_address,
      symbol: nftInfo.nft_info.symbol,
      rarity: {},
      traits: metadata?.attributes || [],
      auction: nftInfo.auction || [],
      bid: nftInfo.bid || [],
    };

    // console.log("nft: ", nft);

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

    return queryResult;
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const delayTime = Math.pow(2, retryCount) * RETRY_DELAY;
      console.log(`Retrying after ${delayTime} ms`);
      await delay(delayTime);
      return queryContract(contractAddress, queryMsg, retryCount + 1);
    } else {
      // throw new Error("Max retry attempts reached");
      console.log("error contract fetching", queryMsg);
      return null;
    }
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCollection = async (address) => {
  try {
    const api_url = process.env.API_URL;
    const result = await axios.get(
      `${api_url}/nfts/${address}?get_tokens=false`
    );
    return result.data;
  } catch (err) {
    console.log("error", err);
  }

  return null;
};

const getPfp = async (name, address) => {
  const asset_url = process.env.ASSET_URL;
  let pfpName = name.replaceAll("-", "").toLowerCase();

  let ret = await checkUrl(`${asset_url}/pfp/${pfpName}.png`);
  if (ret) {
    return `${asset_url}/pfp/${pfpName}.png`;
  }

  ret = await checkUrl(`${asset_url}/pfp/${pfpName}.jpg`);
  if (ret) {
    return `${asset_url}/pfp/${pfpName}.jpg`;
  }

  //url("https://static-assets.pallet.exchange/collections/pfp/sei1ezqkre4j3gkxlfhc23zv7w4nz8guwyczu70w650008dv3yscj2pqky7x7g_pfp.png")
  ret = await checkUrl(`${asset_url}/collections/pfp/${address}_pfp.png`);
  if (ret) {
    return `${asset_url}/collections/pfp/${address}_pfp.png`;
  }

  return "";
};

const checkUrl = async (url) => {
  try {
    const response = await axios.head(url);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(`Error occurred while checking ${url} : `, error.message);
  }

  return false;
};

// Read collections from a file
const readCollectionsFromFile = (filename) => {
  try {
    const directoryPath = __basedir + "/public/assets/";
    const collectionsData = fs.readFileSync(directoryPath + filename, "utf8");
    return JSON.parse(collectionsData);
  } catch (err) {
    console.log(
      `Error readCollectionsFromFile => ${filename} : " ${err.message}`
    );
    return [];
  }
};
