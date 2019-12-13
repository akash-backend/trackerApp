const mongoose = require('mongoose');

const constructionFeedSchema = mongoose.Schema({
  feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed' },
  constructionId: { type: String , required: true },
});

module.exports = mongoose.model('ConstructionFeed', constructionFeedSchema);
