require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
//Cada peticion que se hace siempre pasa por estas lineas.
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//consultar registros

//===========================
//Habilitar la carpeta public
//===========================
//el path.resolve solo agrega un url valido 
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global de rutas
app.use(require('./controladores/index.js'));



//Conexion de la base de datos

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
  //aqui se va a definir un callback para ver si se puede o no abrir la Conexion
  if (err) {
    console.log(err);
    return res.status(400).json({
      ok: false,
      err
    });
    }else{
    console.log('Base de datos online');
  }
});

app.listen(process.env.PORT, ( ) =>{
  console.log("Escuchando por el puerto 3000");
});
