const express = require('express');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res, next) {
  res.json('get usuario local!!!')
  next()
});
//crear registros
app.post('/usuario', function(req, res, next) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
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

    res.json({
      ok: true,
      usuario: usuario
    });
  });
});

//Actualizar
app.put('/usuario/:id', function(req, res, next) {
  let id = req.params.id;
  res.json({
    id
  });
  next()
});
//Borrar, que normalmente solo se actualizan (eliminan)
app.delete('/usuario', function(req, res, next) {
  res.json('delete usuario')
  next()
});

module.exports = app;
