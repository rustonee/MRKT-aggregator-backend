const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const bgRouter = require("./routes/bgprocess");
const collectionRouter = require("./routes/collection");
const nftRouter = require("./routes/nft");
// const collectionsRouter = require("./routes/collections");
// const collectionSettingsRouter = require("./routes/collection-setting");
// const analyticsRouter = require("./routes/analytics");
// const discussionsRouter = require("./routes/discussions");
// const bannersRouter = require("./routes/banners");
// const db = require("./models/index");

global.__basedir = __dirname;

const app = express();

// const cron = require('node-cron');
// cron.schedule('* * * * *', function() {
//   console.log('running a task every 5 seconds');
// });

global.__basedir = __dirname;

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// db.sequelize
//   .sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

app.use("/api", indexRouter);
app.use("/api/bgprocess", bgRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/nfts", nftRouter);
// app.use("/collections", collectionsRouter);
// app.use("/collection-setting", collectionSettingsRouter);
// app.use("/discussions", discussionsRouter);
// app.use("/analytics", analyticsRouter);
// app.use("/banners", bannersRouter);

module.exports = app;
