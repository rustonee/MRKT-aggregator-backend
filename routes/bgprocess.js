var express = require("express");
var router = express.Router();
const controller = require("../controllers/bgprocess.controller");

require("dotenv").config();

router.get("/fetchCollections", controller.fetchCollections);
router.get("/fetchNfts", controller.fetchNfts);
router.get("/fetchMetadata", controller.fetchMetadata);

module.exports = router;
