'use strict';

var Trolley = require('../models/trolley');
var Product = require('../models/producto');
var Factura = require('../models/factura');

function Savecards(req, res ){
    var userId = req.params.id;
    var trolley = new Trolley();
    var params = req.body;

    if(userId != req.user.sub ){
        res.status (500).send({message: 'Debes de Loguearte'});
    }else{
        if(params.product && params.stock ){
            Product.findOne({_id: params.product},(err,product)=>{
                if(err){
                    res.status(500).send({message: 'error al buscar'})
                }else{
                    if(!product){
                        res.status(500).send({message: 'No existe el producto'});
                    }else{
                        var total = (product.price * params.stock);
                        Trolley.findOne({product: params.product},(err, carts)=>{
                            trolley.product = params.product;
                            trolley.comprador = userId;
                            trolley.stock = params.stock;
                            trolley.fecha = new Date(Date.now());
                            trolley.total = total;
                            trolley.save((err,trolleySave)=>{
                                res.status(200).send({Compra: trolleySave});
                                });
                        });
                    }
                }
            });
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos'});
        }
    }
}
function updateCarts (req, res){
    var userId = req.params.id;
    var carritoId = req.params.ide;
    var update = req.body;
    if(userId != req.user.sub){
        res.status(500).send({message: 'Debes de loguearte'});
    }else{
        Trolley.findOne({_id: carritoId},(err,issetCarrito)=>{
            if(err){
                res.status(500).send({message: 'Error'});
            }else{
                if(issetCarrito.comprador != userId){
                    res.status(500).send({message: 'No eres el dueño del carrito'});
                }else{
                    if(update.stock){
                        Product.findOne({_id: issetCarrito.product},(err, producto)=>{
                            var total = (producto.price * update.stock);
                            Trolley.findByIdAndUpdate({_id: carritoId},{stock: update.stock, total:total}, {new: true}, (err,updateCarrito)=>{
                                if(err){
                                    res.status(500).send({message: 'Error'});
                                }else{
                                    res.status(200).send({Carrito: updateCarrito});
                                }
                            });
                        });
                    }else{
                        if(update.product || update.fecha){
                            res.status(500).send({message: 'No puedes modificar esos campos'});
                        }else{
                            Trolley.findByIdAndUpdate({_id: carritoId},update, {new: true}, (err,updateCarrito)=>{
                                if(err){
                                    res.status(500).send({message: 'Error'});
                                }else{
                                    res.status(200).send({Carrito: updateCarrito});
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}
function deleteCarrito(req,res){
    var userId = req.params.id;
    var carritoId = req.params.ide;
    if(userId != req.user.sub){
        res.status(500).send({message: 'Debes de loguearte'});
    }else{
        Trolley.findOne({_id: carritoId}, (err, carrito)=>{
            if(err){
                res.status(500).send({message: 'Se produjo un error'});
            }else{
                if(carrito.comprador != userId){
                    res.status(500).send({message: 'No eres el dueño del carrito'});
                }else{
                    Trolley.findByIdAndDelete(carrito,(err)=>{
                        if(err){
                            res.status(500).send({message: 'Se produjo un error al eliminar'});
                        }else{
                            res.status(200).send({message: 'Fue eliminado de la base de datos'});
                        }
                    })
                }
            }
        });
    }
}
module.exports = {
    Savecards,
    updateCarts,
    deleteCarrito
}