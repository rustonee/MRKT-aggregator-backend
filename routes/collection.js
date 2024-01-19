var express = require("express");
var router = express.Router();
const controller = require("../controllers/collection.controlloer");

require("dotenv").config();

router.get("/", controller.getCollections);
router.get("/:address", controller.getCollection);

module.exports = router;
