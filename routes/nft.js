var express = require("express");
var router = express.Router();
const controller = require("../controllers/nft.controller");

require("dotenv").config();

router.get("/:address", controller.getNfts);
router.get("/:address/:tokenId", controller.getNft);
router.get("/activities/:address/:tokenId", controller.getNftActivities);

module.exports = router;
