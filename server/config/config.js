require('dotenv').load();
//===
//Puerto
//====
process.env.PORT =process.env.PORT || 3000;

//===
//Entorno
//====
let entorno=process.env.NODE_ENV || 'dev';
//process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const user = process.env.USR;
const pwd = process.env.PASS;
//===
//Base de datos
//====

let urlDB;
if (entorno==='dev') {
  urlDB = 'mongodb://localhost:27017/cafe'

}else{
  //Conexion a una base de datos en la nube:
  urlDB = 'mongodb+srv://'+user+':'+pwd+'@cafe-vj8ez.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB;


//=====================
//Vencimiento del token
//====================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//======================
//SEED  de autenticacion
//=====================
process.env.SEED = process.env.SEED || 'secret';


//======================
//google client id
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '800380300525-togd66ct5j1b19a6c9ob9tb50p5rqn0g.apps.googleusercontent.com';
