'use strict';

var express = require('express');
var adminController = require('../controllers/adminController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.get('/Prueba', adminController.prueba);
api.post('/saveUser/:id', md_auth.ensureAut,adminController.saveUser);
api.post('/login', adminController.login);
api.put('/updateUser/:id/:ide', md_auth.ensureAut, adminController.updateUser);
api.put('/deleteUser/:id/:ide', md_auth.ensureAut, adminController.deleteUser);
/*--------Rutas de Gestion de productos*/
api.post('/saveProduct/:id', md_auth.ensureAut, adminController.saveProduct);
api.put('/updateProduct/:id/:ide', md_auth.ensureAut, adminController.updateProduct);
api.put('/deleteProduct/:id/:ide', md_auth.ensureAut, adminController.deleteProduct);

/**-----------Rutas de Gestion de Categoria------------------ */
api.post('/saveCategoria/:id', md_auth.ensureAut, adminController.saveCategory);
api.get('/reportCategoria/:id', md_auth.ensureAut, adminController.reporteCategory);
api.put('/updateCategoria/:id/:ide', md_auth.ensureAut, adminController.updateCategory);
api.put('/deleteCategoria/:id/:ide', md_auth.ensureAut, adminController.deleteCategory);

/**------------Rutas de Gestion de Facturas-------------------------------------------- */
api.post('/Factura/:id/:ide', md_auth.ensureAut, adminController.saveFactura);
api.get('/ReporteFactura/:id', md_auth.ensureAut, adminController.reporteFactura);
api.get('/ProductoFactura/:id/:ide', md_auth.ensureAut, adminController.productFactura);
api.get('/notificar/:id', md_auth.ensureAut, adminController.notificar);
module.exports = api;