'use strict';

var express = require('express');
var clienteController = require('../controllers/clienteController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/login', clienteController.login);
api.post('/saveCliente',clienteController.saveCliente);
api.get('/masVendidos/:id', md_auth.ensureAut, clienteController.masvendidos);
api.post('/BuscarProducto/:id', md_auth.ensureAut, clienteController.busquedaProduct);
api.get('/catalago/:id', md_auth.ensureAut, clienteController.Catalogo);
api.get('/reporteFactura/:id/:ide', md_auth.ensureAut, clienteController.reportFactura);
api.put('/updateProfile/:id', md_auth.ensureAut, clienteController.updateUser);
api.put('/deleteProfile/:id', md_auth.ensureAut, clienteController.deleteUser);

module.exports = api;