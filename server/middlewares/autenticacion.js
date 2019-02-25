const jwt = require('jsonwebtoken');

//========================
//Verificar Token
//========================
//El next continua con la ejecucion del programa
let verificaToken = ( req, res, next ) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED ,(err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err: {
            message: 'Token no valido'
          }
        });
      }

      req.usuario = decoded.usuario;
      next()
    });

};

//===================
//Verifica Admin_Role
//==================

let verificaAdminrole = (req, res, next) => {

  let usuario =  req.usuario;
  let role = req.usuario.role;

  if (role === 'ADMIN_ROLE'){
      next();
  }else{
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
};


module.exports = {
  verificaToken,
  verificaAdminrole
}
