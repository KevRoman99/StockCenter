'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_proyecto';

exports.ensureAut = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(404).send({message: 'la pericion de la cabecera no tiene autentificacion'});

    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.ex <= moment().unix()){
            return res.status(404).send({
                message: 'El token ha expirado!!'
            });
        }
    }catch(exp){
        return res.status(404).send({message: 'El token no es valido'});
    }
    req.user = payload;
    next();
}