require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
//Cada peticion que se hace siempre pasa por estas lineas.
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//consultar registros
app.get('/usuario', function (req, res) {
  res.json('get usuario')
});
//crear registros
app.post('/usuario', function (req, res) {
  let body = req.body;

  if (body.nombre === undefined) {

    res.status(400).json({
      ok: false,
      mensaje:'El nombre es necesario'
    });
  }else{
  res.json({
    persona: body
  });
}
});
//Actualizar
app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  res.json({
    id
  });
});
//Borrar, que normalmente solo se actualizan (eliminan)
app.delete('/usuario', function (req, res) {
  res.json('delete usuario')
});


app.listen(process.env.PORT, () =>{
  console.log("Escuchando por el puerto 3000");
});
