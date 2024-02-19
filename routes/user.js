var express = require("express");
var router = express.Router();
const controller = require("../controllers/user.controller");

require("dotenv").config();

router.get("/:walletAddress/collections", controller.getUserCollections);
router.get("/:walletAddress/nfts", controller.getUserNfts);
router.get("/:walletAddress/activities", controller.getUserActivities);

module.exports = router;
