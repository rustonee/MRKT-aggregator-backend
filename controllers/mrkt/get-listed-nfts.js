// const { retryDecorator } = require("ts-retry-promise");

// exports.getListedNftsFromMrktContract = retryDecorator(
//   (client) =>
//     client
//       .queryContractSmart(process.env.MRKT_CONTRACT_ADDRESS, {
//         get_sales: {},
//       })
//       .then((response) => response.list),
//   { delay: 200, retries: 6 },
// );
