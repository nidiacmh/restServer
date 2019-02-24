require('dotenv').load();
//===
//Puerto
//====
process.env.PORT =process.env.PORT || 3000;

//===
//Entorno
//====

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const user = process.env.USR;
const pwd = process.env.PASS;
//===
//Base de datos
//====

let urlDB;
if (!process.env.NODE_ENV) {
  urlDB = 'mongodb://localhost:27017/cafe'

}else{
  //Conexion a una base de datos en la nube:
  urlDB = 'mongodb+srv://'+user+':'+pwd+'@cafe-vj8ez.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB;
