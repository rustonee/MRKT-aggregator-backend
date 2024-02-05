const CollectionMonitor = require("../../models/collection-monitor.model");

exports.calculatePriceChangeAndSaleCount = async (address) => {
  try {
    const currentCollection = await CollectionMonitor.findOne({
      contract_address: address
    }).sort({ date: -1 });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const previousCollection = await CollectionMonitor.findOne({
      date: { $lte: oneDayAgo },
      contract_address: address
    }).sort({ date: -1 });

    const currentFloor = currentCollection.floor;
    const previousFloor = previousCollection.floor;

    const current24hVolume = currentCollection.volume;
    const previous24hVolume = previousCollection.volume;

    return {
      _24hFloorChange: (currentFloor - previousFloor) / currentFloor,
      _24hVolumeChange:
        (current24hVolume - previous24hVolume) / current24hVolume,
      saleCount: currentCollection.sale_count
    };
  } catch (error) {
    return {};
  }
};
