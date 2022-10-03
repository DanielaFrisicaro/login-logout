var express = require('express');
const { use } = require('../app');
var router = express.Router();



//requerir multer(//paso 1 instalación)
const path = require('path')
const multer = require('multer');//paso 2.

//paso 3
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})*/

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-'+Date.now()+path.extname(file.originalname))
  }
})


//constante que genera el metodo que me permite cargar el archivo
//paso 4
const upload = multer({ storage: storage })

//requerir express-validator
//body y check//
const {body} = require('express-validator')

const validations = [
body('name').notEmpty().withMessage('Debe escribir un nombre'),
body('email')
.notEmpty().withMessage('Debe escribir un email').bail()
.isEmail().withMessage('Debe escribir un formato valido'),
body('password').notEmpty().withMessage('Debe escribir su password'),
body('address').notEmpty().withMessage('Debe escribir una dirección'),
body('city').notEmpty().withMessage('Debe escribir una ciudad'),
body('avatar').custom((value, {req}) => {//valido lo que quiero con custom y luego pedir un return
  let file = req.file//puedo acceder al file req. body y req. file archivo gracias al multer
  let acceptedExtensions = ['.jpg', '.png', '.gif', '.jpeg']
 
  if (!file) {
    throw new Error ('Debe subir una imagen')
  }
  //includes es un metodo o funcion que devuelve de array que devuelve un booleano
  else {
    let fileExtension = path.extname(file.originalname)
    if (!acceptedExtensions.includes(fileExtension)) {
    throw new Error (`Las extensiones de archivos permitidos son ${acceptedExtensions.join(', ') } `)
  }

  }

  return true;
})
]

const usersController = require('../controllers/usersController')
const guestMiddleware = require('../middlewares/guestMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
//..................................................RUTAS...........................................................//
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



//Formulario de Registro
router.get('/register', guestMiddleware,usersController.register );
//Procesar el Registro
router.post('/register', upload.single('avatar'), validations, usersController.processRegister );
//Formulario de Login
router.get('/login',guestMiddleware, usersController.login);
//Procesar el Login
router.post('/login', usersController.processLogin);


//Perfil de usuario
router.get('/profile',authMiddleware, usersController.profile)

//Logout. Lo hago por GET pero podría ir por POST.
router.get('/logout', usersController.logout)


module.exports = router;
