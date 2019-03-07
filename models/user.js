'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    role: String
});

module.exports = mongoose.model('users', usuarioSchema);