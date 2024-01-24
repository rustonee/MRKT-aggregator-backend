const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const bgRouter = require("./routes/bgprocess");
const collectionRouter = require("./routes/collection");
const nftRouter = require("./routes/nft");
const mongoose = require("mongoose");
const { dbConfig } = require("./config/db.config");

const cron = require("node-cron");
const bgController = require("./controllers/bgprocess.controller");

global.__basedir = __dirname;

const app = express();

cron.schedule("*/10 * * * *", async function () {
  console.log("running a task every 10 minutes");
  await bgController.fetchCollections();
});

global.__basedir = __dirname;

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect(dbConfig.connectionUrl, dbConfig.connectionOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/nfts", nftRouter);

module.exports = app;
