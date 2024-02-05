var express = require("express");
const authenticationMiddleware = require("../middleware/auth");
var router = express.Router();
const controller = require("../controllers/collection.controlloer");

require("dotenv").config();

router.post("/", authenticationMiddleware, controller.createCollection);

router.get("/", controller.getCollections);
router.get("/:address", controller.getCollection);
router.get("/:address/traits", controller.getCollectionTraits);

module.exports = router;
