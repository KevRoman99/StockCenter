'use strict';

var Categoria = require('../models/category');
var Product = require('../models/producto');
var Factura = require('../models/factura');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwt');

/**--------------------------Login------------------------------------- */
function login(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err,user)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar iniciar seccion'});
        }else{
            // if(user.role == 'Cliente'){
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            // res.status(200).send({user});
                            Factura.find({comprador: user.id},(err,reportFactura)=>{
                                if(err){
                                    res.status(500).send({message: 'Error al buscar la factura'});
                                }else{
                                    if(!reportFactura){
                                        res.status(500).send({message: 'Error al mostrar'});
                                    }else{
                                        res.status(200).send({Compras: reportFactura});
                                    }
                                }
                            });
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no pudo Logearse'});
                    }
                });
            // }else{
            //     res.status(404).send({message: 'Solo administradores pueden logearse'});
            // }
        }
    });
}
/**-------------Registrar a cliente-------------------------- */
function saveCliente(req, res){
    var user = new User();
    var params = req.body;

            if (params.name && params.lastname && params.email && params.password ){
                user.name = params.name;
                user.lastname = params.lastname;
                user.email = params.email;
                user.role = 'Cliente';
                    User.findOne({email: user.email.toLowerCase()}, (err, issetUser)=>{
                        if(err){
                            res.status(500).send({message: 'Error, el correo ya ha sido registrado'});
                        }else{
                            if(!issetUser){
                                bcrypt.hash(params.password, null, null, function(err, hash){
                                    user.password = hash;
    
                                    user.save((err, userStored)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error al guardar '});
                                        }else{
                                            if(!userStored){
                                                res.status(404).send({message: 'No se ha podido registrar el usuario'});
                                            }else{
                                                res.status(200).send({user: userStored});
                                            }
                                        }
                                    });
                                });
                            }else{
                                res.status(500).send({message: 'El correo ya fue registrado'});
                            }
                        }
                    });
            }else{
                res.status(500).send({message: 'Debes de llenar todos los campos requeridos'});
         
            }
    
}
/**------------------Productos mas vendidos----------------------- */
async function masvendidos(req,res){
    var clienteId = req.params.id;
    
    if(clienteId != req.user.sub || req.user.role != 'Cliente'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        const vendido = await Product.find().select('name categoria vendido').sort({'vendido': -1}).limit(5)
        return res.status(200).send({Vendidos: vendido});
    }
}
/**------------------Busqueda de productos------------------------------------------ */
function busquedaProduct(req,res){
    var clienteId = req.params.id;
    var params = req.body;
    var name = params.name;
    if(clienteId != req.user.sub || req.user.role != 'Cliente'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Product.findOne({name: name},(err, reportProduct)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar'});
            }else{
                if(!reportProduct){
                    res.status(500).send({message: 'El producto no existe'});
                    console.log(reportProduct);
                    console.log(buscar);
                }else{
                    res.status(200).send({Producto: reportProduct});
                }
            }
        });
    }
}
/**--------------------------Catalogo------------------------------------------- */
function Catalogo (req,res){
    var clienteId = req.params.id;
    var params = req.body;
    var categoria = params.categoria
    if(clienteId != req.user.sub ||req.user.role != 'Cliente'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Categoria.find({},(err,category)=>{
            if(err){
                res.status(500).send({message: 'Error al mostrar'});
            }else{
                if(params.categoria){
                    Product.findOne({categoria: categoria}, (err,producto)=>{
                        if(err){
                            res.status(500).send({message: 'Error al mostrar'});
                        }else{
                            if(!producto){
                                res.status(500).send({message: 'No existe el producto'});
                            }else{
                                // res.status(200).send({Categoria: categoria,Producto: producto});
                                Categoria.findOne({_id: categoria},(err,categorias)=>{
                                    if(err){
                                        res.status(500).send({message: 'Se ha producido un error'});
                                    }else{
                                        if(!categorias){
                                            res.status(500).send({message: 'La categoria no existe'});
                                        }else{
                                            res.status(200).send({Categoria: categorias.name, Product: producto});
                                        }
                                    }
                                    
                                })
                            }
                        }
                    });
                }else{
                    res.status(200).send({Categoria: category});
                }
            }
        })
    }
}
/**-----------------------------------------------Reporte de factura----------------------------------------------------------- */
function reportFactura(req,res){
    var clienteId = req.params.id;
    var facturaId = req.params.ide;
    if(clienteId != req.user.sub || req.user.role != 'Cliente'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Factura.findOne({_id: facturaId},(err, facturita)=>{
            if(err){
                res.status(500).send({message: 'Se produjo un error'});
            }else{
                if(facturita.comprador == clienteId){
                    res.status(200).send({Factura: facturita});
                }else{
                    res.status(500).send({message: 'No eres el dueño de la factura'});
                }
            }
        })
    }
}
/**--------------------------------------Update user--------------------------------------------------------- */
function updateUser (req, res){
    var update = req.body;
    var userId = req.params.id;


    if(userId != req.user.sub || req.user.role != 'Cliente'){
            res.status(500).send({message: 'No tienes permiso'});
    }else{
        User.findByIdAndUpdate(userId,update,{new: true}, (err, updateUser)=>{
            if(err){
                 res.status(500).send({message: 'Error al actualizar'});
            }else{
                if(!updateUser){
                    res.status(404).send({message: 'No se pudo actualizar'});
                }else{
                    res.status(200).send({user: updateUser});
                }
            }
        });
    }
}
function deleteUser(req, res){
    var userId = req.params.id;
    if(userId != req.user.sub || req.user.role != 'Cliente'){
        res.status(500).send({message: 'No tienes permisos'});
    }else{
        User.findByIdAndDelete(userId,(err)=>{
            if(err){
                res.status(500).send({message: 'Error al eliminar'});
            }else{
                res.status(200).send({message: 'Eliminado de la base de datos'});
            }
        });
    }
}
module.exports = {
    login,
    masvendidos,
    busquedaProduct,
    saveCliente,
    Catalogo,
    reportFactura,
    updateUser,
    deleteUser
}