//===
//Puerto
//====

process.env.PORT =process.env.PORT || 3000;

//===
//Entorno
//====

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===
//Base de datos
//====

let urlDB;

if (process.env.NODE_ENV) {
  urlDB = 'mongodb://localhost:27017/cafe'

}else{
  //Conexion a una base de datos en la nube:
  urlDB = 'mongodb+srv://nidia:Anilorac_aidin08@cafe-vj8ez.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB;
