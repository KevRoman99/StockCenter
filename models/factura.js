'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    // vendedor: {type: Schema.ObjectId, ref: 'users' },
    // comprador: {type: Schema.ObjectId, ref: 'users'},
    // producto: {type: Schema.ObjectId, ref: 'products'},
    // stock: Number,
    // fecha: Date, 
    // total: Number
    comprador: {type: Schema.ObjectId, ref: 'users'},
    cards:  [{type: Schema.ObjectId}],
    total: Number,
    fecha: Date
});
module.exports = mongoose.model('facturas', facturaSchema);