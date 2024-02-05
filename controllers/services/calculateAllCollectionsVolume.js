const Collection = require("../../models/collection.model");

exports.calculateAllCollectionsVolume = async () => {
  const [{ allCollectionsVolume }] = await Collection.aggregate([
    {
      $group: {
        _id: null,
        allCollectionsVolume: {
          $sum: "$volume"
        }
      }
    }
  ]);

  return allCollectionsVolume;
};
