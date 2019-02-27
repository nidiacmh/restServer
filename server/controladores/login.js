const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN
    });

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  })
});

//configuraciones de google
async function verify(token) {
  // console.log(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // console.log(payload.name);
  // console.log(payload.email);
  // console.log(payload.picture);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {

  let token = req.body.idtoken;
  let googleUser = await verify(token)
    .catch(e => {
      return res.status(403).json({
        ok: false,
        err: e
      });
    })

  Usuario.findOne({
    email: googleUser.email
  }, (err, usuarioDB, next) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Dese usar su autenticacion normal'
          }
        });
      } else {

        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      }

    } else {
      //Si es la primera vez que el usuario ingresa y no existe en nuestra BD
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      });
    }
  });
  //Impresion de mi usuario
  // res.json({
  //   usuario: googleUser
  // });
});

module.exports = app;
