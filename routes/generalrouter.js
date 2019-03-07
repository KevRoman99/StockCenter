'use strict';

var express = require('express');
var clienteController = require('../controllers/generalController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
/**-------------Carrito----------------------------------------- */
api.post('/Carrito/:id', md_auth.ensureAut, clienteController.Savecards);
api.put('/updateCarrito/:id/:ide', md_auth.ensureAut, clienteController.updateCarts);
api.put('/deleteCarrito/:id/:ide', md_auth.ensureAut, clienteController.deleteCarrito);
module.exports = api;