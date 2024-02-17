var express = require("express");
const authenticationMiddleware = require("../middleware/auth");
var router = express.Router();
const controller = require("../controllers/collection.controller");

require("dotenv").config();

router.post("/", authenticationMiddleware, controller.createCollection);

router.get("/", controller.getCollections);
router.get("/:address", controller.getCollection);
router.get("/:address/traits", controller.getCollectionTraits);
router.get("/:address/activities", controller.getCollectionActivities);
router.get("/mrkt/:address/nfts", controller.getListedNftOnMrktCollection);

module.exports = router;
