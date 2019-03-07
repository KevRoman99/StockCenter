'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = Schema({
    name: String,
    descripcion: String,
});

module.exports = mongoose.model('categorys', categorySchema);