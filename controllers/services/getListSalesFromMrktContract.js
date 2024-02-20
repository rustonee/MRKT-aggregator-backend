const { retryDecorator } = require("ts-retry-promise");

exports.getListSalesFromMrktContract = retryDecorator(
  async (client) => {
    return client.queryContractSmart(process.env.MRKT_CONTRACT, {
      get_sales: {},
    });
  },
  { delay: 120, retries: 3 },
);
