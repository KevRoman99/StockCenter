'use strict';
var User = require('../models/user');
var Producto = require('../models/producto');
var Category = require('../models/category');
var Trolley = require('../models/trolley');
var Factura = require('../models/factura');
var jwt = require('../service/jwt');
var bcrypt = require('bcrypt-nodejs');
var Factura = require('../models/factura');

/*-------------------Gestion de Usuario-------------------*/ 
function saveUser(req, res){
    var user = new User();
    var params = req.body;
    var adminId = req.params.id;
    if(adminId != req.user.sub || req.user.role != 'Admin'){
            res.status(500).send({message: 'No tienes permiso'});
    }else{
            if (params.name && params.lastname && params.email && params.password && params.role){
                user.name = params.name;
                user.lastname = params.lastname;
                user.email = params.email;
                user.role = params.role;
                if(user.role == 'Admin' || user.role == 'Cliente'){
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
                    res.status(500).send({message: 'Los roles son Admin o Cliente'});
                }
            }else{
                res.status(500).send({message: 'Debes de llenar todos los campos requeridos'});
         
            }
    }
    
}
function updateUser (req, res){
    var update = req.body;
    var adminId = req.params.id;
    var userId = req.params.ide;


    if(adminId != req.user.sub || req.user.role != 'Admin'){
            res.status(500).send({message: 'No tienes permiso'});
    }else{
        
        User.findOne({_id: userId}, (err, issetUser)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar el usuario'});
            }else{
                if(issetUser.role == 'Cliente'){
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
                }else{
                    res.status(500).send({message: 'Solo los de rol Cliente se puede actualizar'});
                }
            }
        });
    }
}
function deleteUser(req, res){
    var adminId = req.params.id;
    var userId = req.params.ide;
    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permisos'});
    }else{
        User.findOne({_id: userId}, (err, issetUser)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar el usuario'});
            }else{
                if(issetUser.role == 'Cliente'){
                    User.findByIdAndDelete(userId,(err)=>{
                        if(err){
                            res.status(500).send({message: 'Error al eliminar'});
                        }else{
                            res.status(200).send({message: 'Eliminado de la base de datos'});
                        }
                    });
                }else{
                    res.status(500).send({message: 'Solo se puede eliminar los de rol Cliente'});
                }
            }
        });
    }
}
function login(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err,user)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar iniciar seccion'});
        }else{
            if(user.role == 'Admin'){
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            // res.status(200).send({user});
                            Producto.find({},(err,reportProduct)=>{
                                if(err){
                                    res.status(500).send({message: 'Error al buscar el producto'});
                                }else{
                                    if(!reportProduct){
                                        res.status(500).send({message: 'No existe el producto'});
                                    }else{
                                        res.status(200).send({Productos: reportProduct});
                                    }
                                }
                            });
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no pudo Logearse'});
                    }
                });
            }else{
                res.status(404).send({message: 'Solo administradores pueden logearse'});
            }
        }
    });
}
/**----------------Gestion de productos --------------*/
function saveProduct(req, res){
    var adminId = req.params.id;
    var product = new Producto();
    var params = req.body;
    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes Permisos'});
    }else{
        if(params.name && params.descripcion && params.stock && params.price){
            product.name = params.name;
            product.descripcion = params.descripcion;
            product.stock = params.stock;
            product.categoria = params.categoria;
            product.price = params.price;
            Category.findOne({_id: params.categoria},(err,categorialo)=>{
                if(err){
                    res.status(500).send({message: 'Error al buscar la categoria'});
                }else{
                    if(!categorialo){
                        res.status(500).send({message: 'No existe la categoria'});
                    }else{
                        product.save((err, productStored)=>{
                            if(err){
                                res.status(500).send({message: 'Error al guardar'});
                            }else{
                                if(!productStored){
                                    res.status(404).send({message: 'No se ha podudo guardar'});
                                }else{
                                    res.status(200).send({Producto: productStored});
                                }
                            }
                        });
                    }
                        
                }
            })
            
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos'});
        }
    }
}
function updateProduct (req, res){
    var adminId = req.params.id;
    var productId = req.params.ide;
    var update = req.body;

    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Producto.findByIdAndUpdate(productId,update, {new: true}, (err, updateProduct)=>{
            if(err){
                res.status(500).send({message: 'Error al actualizar'});
            }else{
                if(!updateProduct){
                    res.status(404).send({message: 'No se pudo actualizar'});
                }else{
                    res.status(200).send({Actualizancion: updateProduct});
                }
            }
        });
    }

}
function deleteProduct (req, res){
    var adminId = req.params.id;
    var productId = req.params.ide;

    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Producto.findByIdAndDelete(productId,(err)=>{
            if(err){
                res.status(500).send({message: 'Error al eliminar'});
            }else{
                res.status(200).send({message: 'Fue eliminado de la base de datos'});
            }
        });
    }
}
/**-----------------Categorias------------ */
function saveCategory (req, res){
    var adminId = req.params.id;
    var params = req.body;
    var category = new Category();
    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        if(params.name && params.descripcion){
            category.name = params.name;
            category.descripcion = params.descripcion;

            Category.findOne({name: category.name.toLowerCase()}, (err, issetCateogry)=>{
                if(err){
                    res.status(500).send({message: 'Ya existe la categoria'});
                }else{
                    if(!issetCateogry){
                        category.save((err, categoryStored)=>{
                            if(err){
                                res.status(404).send({message: 'Error al guardar'});
                            }else{
                                res.status(200).send({Categoria: categoryStored});
                            }
                        });
                    }else{
                        res.status(500).send({message: 'Ya existe la categoria'});
                    }
                }
            });
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos'});
        }
    }
}
function reporteCategory(req, res){
    var adminId = req.params.id;
    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Category.find({}, (err, reporteCategory)=>{
            if(err){
                res.status(500).send({message: 'Error al mostrar'});
            }else{
                if(!reporteCategory){
                    res.status(404).send({message: 'Error al mostrar'});
                }else{
                    res.status(200).send({Categorias: reporteCategory});
                }
            }
        });
    }
}
function updateCategory(req, res){
    var adminId = req.params.id;
    var categoryId = req.params.ide;
    var update = req.body;
    if(adminId != req.user.sub ||req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Category.findByIdAndUpdate(categoryId,update,(err, updateCategory)=>{
            if(err){
                res.status(500).send({message: 'Error al Actualizar'});
            }else{
                if(!updateCategory){
                    res.status(404).send({message: 'Error al actualizar!!'});
                }else{
                    res.status(200).send({Categoria: updateCategory});
                }
            }
        })
    }
}
function deleteCategory(req, res){
    var adminId = req.params.id;
    var categoryId = req.params.ide;

    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Category.findOne({name: "default"}, (err, issetdefault)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar la categoria default'});
            }else{
                Category.findById(categoryId, (err, issetCateogry)=>{
                    if(err){
                        res.status(500).send({message: 'Error al buscar'});
                    }else{
                        if(!issetCateogry){
                            res.status(500).send({message: 'La categoria no existe'});
                        }else{
                            Producto.updateMany({categoria: issetCateogry.id}, {categoria: issetdefault.id}, {new: true},(err,updateProduct)=>{
                                if(err){
                                    res.status(500).send({message: 'Error'});
                                }else{
                                    if(!updateProduct){
                                        res.status(500).send({message: 'No se pudo modificar a la categoria Defaultd'});
                                    }else{
                                        Category.findByIdAndDelete(categoryId, (err)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error al eliminar la categoria'});
                                            }else{
                                                res.status(200).send({message: 'Fue eliminado de la base de datos'});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}
function saveCategoryDefault(req, res){
    var category = new Category();
    
    category.name = 'default';
    Category.find({name: 'default'}, (err, reportcategory)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar de crear la categoria por defecto'});
        }else{
            if(reportcategory && reportcategory.length >= 1){
                console.log('Ya existe la categoria por defecto');
            }else{
                category.save();
                console.log('Se ha creado la categoria por defecto');
            }
        }
    })
}

/**----------------------------------Gestion de facturas --------------------------------------*/
function saveFactura(req,res){
    var AdminId = req.params.id;
    var userId = req.params.ide;
    var facturas = new Factura();
    var totales = 0;
    if(AdminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No eres Administrador, te puedes registrar en Administración registrarte!!'});
    }else{
        
        Trolley.find({comprador: userId},(err, trolleys)=>{
            if(err){
                res.status(500).send({message: 'Error'})
            }else{
                trolleys.forEach(lugar =>{
                    // if(lugar.product == '5c7d5b3de3c8182ae8c4439b'){
                    //     res.status(200).send({message: 'Hola'});
                    // }
                    totales += lugar.total; 
                    
                    Producto.findById({_id: lugar.product},(err, issetProduct)=>{
                        // res.status(200).send({Product: issetProduct.stock});
                        // var stocked = issetProduct.stock - lugar.stock
                        // issetProduct.stock = stocked
                        // issetProduct.save();  
                        // issetProduct.forEach(productmodif =>{
                            // res.status(200).send({stock: productmodif.stock});
                            var suma = issetProduct.vendido + 1;
                            var stocked = issetProduct.stock - lugar.stock;
                            if(stocked < 0){
                                console.log('Ya no hay productos');
                                // (JSON.stringify('No'));
                            }else{
                                
                                Producto.findOneAndUpdate({_id: lugar.product},{stock: stocked, vendido: suma}, {new: true}, (err,updateProduct)=>{
                                    // res.status(200).send({update: updateProduct})
                                    
                                });
                            }
                            
                        // })
                        
                    });
                });
                // if(stocked <=0){
                //     res.status(500).send({message: 'No tienes productos'});
                // }else{
                    facturas.comprador = userId;
                    facturas.cards = trolleys;
                    facturas.total = totales;
                    facturas.fache = new Date(Date.now());

                    facturas.save((err, facturaStored)=>{
                        if(err){
                           res.status(500).send({message: 'Error al guardar'});
                        }else{
                            res.status(200).send({facturaStored});
                            // Trolley.findByIdAndDelete( userId,(err)=>{
                            //     if(err){
                            //         res.status(500).send({message: 'Error al eliminar'});
                            //     }else{
                            //         res.status(200).send({Factura: facturaStored});
                            //     }
                            // })
                        }
                    })
                // }
                
                // res.status(200).send({Producto: trolleys});
                // Product.find({_id: trolleys}, (err, issetProduct)=>{
                //     res.status(200).send({product: issetProduct});
                // })
            }
            
            // var datos = [trolleys.comprador];
            // res.status(200).send({Trolley: datos});
        });
    }
}
function reporteFactura(req,res){
    var adminId = req.params.id;

    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso ' + adminId});
    }else{
        Factura.find({},(err, facturita)=>{
            if(err){
                res.status(500).send({message: 'Se produjo un error'});
            }else{
                res.status(200).send({Factura: facturita});
            }
        })
    }
}
function productFactura(req,res){
    var adminId = req.params.id;
    // var factura = req.params.ide;
    var facturaId = req.params.ide;

    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'Solo los administradores tiene permiso'});
    }else{
        Factura.findOne({_id: facturaId},(err,reportFactura)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar'});
            }else{
                if(!reportFactura){
                    res.status(500).send({message: 'La factura no existe'});
                }else{
                    res.status(200).send({Producto: reportFactura.cards});
                }
            }
        })
    }
}
function notificar(req,res){
    var adminId = req.params.id;
    if(adminId != req.user.sub || req.user.role != 'Admin'){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        Producto.find({stock: {$lt: 0}}, (err, product)=>{
            if(err){
                res.status(500).send({message: 'Error'});
            }else{
                res.status(200).send({message:'Los productos agotados son: ',Productos:  product});
            }
        });
    }
}
function prueba(req,res){
    res.status(500).send({message: 'Probando el servidor'});
}

module.exports = {
    prueba,
    saveUser,
    login,
    updateUser,
    deleteUser,
    saveProduct,
    updateProduct,
    deleteProduct,
    saveCategory,
    reporteCategory,
    updateCategory,
    deleteCategory,
    saveCategoryDefault,
    saveFactura,
    reporteFactura,
    productFactura,
    notificar
}