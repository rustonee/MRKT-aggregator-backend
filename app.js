const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const collectionRouter = require("./routes/collection");
const nftRouter = require("./routes/nft");
const userRouter = require("./routes/user");
const mongoose = require("mongoose");
const { dbConfig } = require("./config/db.config");

const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./api.doc");

global.__basedir = __dirname;

const app = express();

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.use("/api/v1", indexRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/user", userRouter);

module.exports = app;
