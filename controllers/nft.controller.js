const { default: axios } = require("axios");

exports.getNfts = async (req, res) => {
  try {
    const contractAddress = req.params.address.toString();
    const buy_now_only = req.query.buy_now_only || false;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page_size) || 25;

    const api_url = process.env.API_URL;
    const result = await axios.get(
      `${api_url}/nfts/${contractAddress}?get_tokens=true&page=${page}&page_size=${limit}&token_id_exact=false&buy_now_only=${buy_now_only}&min_price_only=false&not_for_sale=false&sort_by_price=asc&sort_by_id=asc`
    );
    console.log(
      `${api_url}/nfts/${contractAddress}?get_tokens=true&page=${page}&page_size=${limit}&token_id_exact=false&buy_now_only=${buy_now_only}&min_price_only=false&not_for_sale=false&sort_by_price=asc&sort_by_id=asc`
    );
    if (!result.data) {
      next(JSON.stringify({ success: false, message: "Can not fetch." }));
    } else {
      const count = result.data.count;
      const nfts = result.data.tokens;

      res.json({ count, nfts });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while fetching the NFTs."
    });
    return;
  }
};

exports.getNft = async (req, res) => {
  try {
    const contractAddress = req.params.address.toString();
    const tokenId = req.params.tokenId.toString();

    const api_url = process.env.API_URL;
    const result = await axios.get(
      `${api_url}/nfts/${contractAddress}?get_tokens=true&token_id=${tokenId}&token_id_exact=true`
    );

    if (!result.data) {
      next(JSON.stringify({ success: false, message: "Can not fetch." }));
    } else {
      const count = result.data.count;
      const nfts = result.data.tokens;
      const nft = nfts[0];

      res.json({ nft });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while fetching the NFTs."
    });
    return;
  }
};

exports.getNftActivities = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const address = req.params.address;

    const eventMapping = {
      sold: "sale",
      listed: `list%5C_`
    };
    const event = eventMapping[req.query.event] || "sale";

    const page = req.query.page;
    const pageSize = req.query.page_size;

    const api_url = process.env.API_URL;

    const result = await axios.get(
      `${api_url}/marketplace/activities?event_type=${event}`,
      {
        params: {
          chain_id: "pacific-1",
          nft_address: address,
          nft_token_id: tokenId,
          page,
          page_size: pageSize
        }
      }
    );

    res.json(result.data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while fetching the nft activities."
    });

    return;
  }
};
