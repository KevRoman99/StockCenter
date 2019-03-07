'use sctrict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({
    name: String,
    descripcion: String,
    stock: Number,
    categoria: {type: Schema.ObjectId, ref: 'categorys'},
    price: Number,
    vendido: Number
});
module.exports = mongoose.model('products', productoSchema);