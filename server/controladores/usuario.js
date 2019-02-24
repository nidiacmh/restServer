const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
var Usuario = require('../models/usuario');
const app = express();

//encuentra todos los registros que se encuentran en la bd
//En el find({aqui se agregan los parametros para buscar unos en especial})
app.get('/usuarios', function(req, res, next) {
  let desde = req.query.desde || 0;
  desde = Number(desde);//para transformar en un numero
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Usuario.find({}, 'nombre email')
          .skip(desde)//se salta los primeros 5
          .limit(limite)
          .exec((err, usuarios) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                err
              });
            }
            //En las {vas a anotar las condiciones, la misma que este en el find}
            Usuario.count({}, (err, conteo) => {

              res.json({
                ok: true,
                usuarios: usuarios,
                cuantos: conteo

              });
            })

          });
  // next()  #---------> si le quitamos el next ya funciona
  //no debe llevar next() para que imprima el res.json
});

//crear registros
app.post('/usuario', function(req, res, next) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  //Para grabar en la base de datos

  usuario.save((err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //usuario.password = null;


    res.json({
      ok: true,
      usuario: usuario
    });
  });
});

//Actualizar
app.put('/usuario/:id', function(req, res, next) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre','email','img','role','estado']);
//   datos que lleva la funcion: (quien? id,objeto a actualizar, (callback que es el err, y quien me trae la informacion)
// pra hacer caso a las validaciones del esquema hay que agregar el run validators como true
  Usuario.findByIdAndUpdate(id, body,{ new: true, runValidators: true}, (err, usuario, next) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };
    res.json({
      ok: true,
      usuario: usuario
    });
  });
});


//Borrar, que normalmente solo se actualizan (eliminan)
app.delete('/usuario/:id', function(req, res, next) {
  let id = req.params.id;

  //------>eliminacion que deje de existir
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado, next) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   };
  //
  //       if (!usuarioBorrado) {
  //         return res.status(400).json({
  //           ok: false,
  //           err:{
  //             message: 'Usuario no encontrado'
  //           }
  //         });
  //       };
  //   res.json({
  //     ok: true,
  //     usuario: usuarioBorrado
  //   });
  // });

  //----->Solo cambia el estado del usuario
  Usuario.findByIdAndUpdate(id, {estado: false} , (err, usuario, next) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };
    res.json({
      ok: true,
      usuario: usuario
    });
  });
});

module.exports = app;
