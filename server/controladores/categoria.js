const express = require('express');

const {
  verificaToken, verificaAdminrole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//=============================
//Mostrar todas las categorias
//==============================
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
      //ordena y se dice por que parametro
      .sort('descripcion')
      //Vamos a usar el populate que nos sirve para identificar que id se estan utilizando
      //El primer parametro es la coleccion y lo segundos es lo que queremos que se muestre
      .populate('usuario', 'nombre email')
      .exec((err, categorias) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });

        }

        res.json({
          ok: true,
          categorias
        });
      })

});

//=============================
//Mostrar todas categorias por id
//==============================
app.get('/categoria/:id',  verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id,(err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok:false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err:{
          message: 'El ID no es correcto'
        }
      });

    }

    res.json({
      ok:true,
      categoria: categoriaDB
    });
  });
});

//=============================
//Crear una nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });


});
//=============================
//Actualiza una categoria
//==============================
app.put('/categoria/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria={
    descripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true} , (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB
      });
    };
  })
});

//=============================
//Borra las categiras
//==============================
app.delete('/categoria/:id',[verificaToken, verificaAdminrole], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    return res.status(500).json({
      ok: false,
      err
    });
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err:{
          message:'El id no existe'
        }
      });
    }

    res.json({
      ok:true,
      message:'Categoria borrada'
    })
  })
});




module.exports = app;
