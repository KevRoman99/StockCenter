'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trolleySchema = Schema({
    product: {type: Schema.ObjectId, ref: 'products'},
    comprador: {type: Schema.ObjectId, ref: 'users'},
    stock: Number,
    fecha: Date, 
    total: Number
});

module.exports = mongoose.model('carts', trolleySchema);