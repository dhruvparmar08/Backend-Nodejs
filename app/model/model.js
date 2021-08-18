var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({

    name : { type: String, required: true },
    image : { type: String, required: true },
    image_path : { type: String, required: true },
    desc : { type: String, required: true },
    price : { type: Number, required: true },
    quantity : { type: Number, required: true },
});

module.exports = mongoose.model('ProductData', ProductSchema);