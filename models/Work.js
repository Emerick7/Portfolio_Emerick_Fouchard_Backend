const mongoose = require('mongoose');

const workSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    imgUrl: { type: String, required: true },
    imagesUrl: [
        { type: String, required: true }
    ],
    year: { type: Number, required: true },
    desc: { type: String, required: true },
});

module.exports = mongoose.model('Work', workSchema);