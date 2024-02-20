var express = require("express");
var router = express.Router();
const controller = require("../controllers/user.controller");

require("dotenv").config();

router.get("/:walletAddress/collections", controller.getUserCollections);
router.get("/:walletAddress/nfts", controller.getUserNfts);
router.get("/:walletAddress/activities", controller.getUserActivities);
router.get(
  "/:walletAddress/mrkt-listed-nfts",
  controller.getListedNftFromMrktMarketByUser,
);

module.exports = router;
