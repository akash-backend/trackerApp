const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
    donor: {type: String, required: true}
});

module.exports = mongoose.model('Feed',feedSchema);