const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res, next) => {
  let body = req.body;

  Usuario.findOne({
    email: body.email
  }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
      token: '123'
    });
  })
});



module.exports = app;