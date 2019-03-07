'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var categoriaDedault = require('./controllers/adminController');
var port = process.env.port || 3789;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Stock', {useNewUrlParser: true})
    .then((err, res)=>{
        console.log('Conexion a la base de datos realizada correactamente!!');
        categoriaDedault.saveCategoryDefault();
        app.listen(port, ()=>{
            console.log('El servidor de node y express estan conectados');
        });
    })
        .catch(err => console.log(err));