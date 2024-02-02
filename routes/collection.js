var express = require("express");
const verifyJWTToken = require("../middleware/authJWT");
var router = express.Router();
const controller = require("../controllers/collection.controlloer");

require("dotenv").config();

router.post("/", verifyJWTToken, controller.createCollection);

router.get("/", controller.getCollections);
router.get("/:address", controller.getCollection);

module.exports = router;
