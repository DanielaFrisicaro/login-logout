//requerir express-validator
const { validationResult } = require('express-validator')

//JSON y database en JSON. REQUIERO EL MODELO.

const User = require('../models/Users')

//requerir el bcryptjs

const bcryptjs = require('bcryptjs')


const controller = {
    //................................................REGISTER........................................................//
    register: (req, res) => {
        //res.cookie('testing', 'Hola Mundo', {maxAge: 1000*3})//LEO LA COOKIE en formulario de LOGIN(cookies en plural).En formulario de REGISTRO la SETEO(cuando seteo lo hago de a una, seteo una cookie).
        console.log(req.cookies.userEmail)//lo paso al form de register desde el profile, para ver si tengo a alguien en la cookie.
        return res.render('register')
    },

    processRegister: (req, res) => {
        // return res.send('ok, usando el post')//prueba de ruteo cuando hago el SUBMIT.
        /*return res.send(
           { body: req.body,
            file: req.file})*///para probar que viene por el body del formulario, USAR el URLENCODED
        //el enctype permite en el controller ademas obtener datos del body también incluyendo los datos de tipo "file"
        //return res.render('register')
        //........VALIDACIÓN DE EXPRESS VALIDATOR..................................///
        const resultValidation = validationResult(req)
        //return res.send(resultValidation)prueba de envío de resultValidation
        if (resultValidation.errors.length > 0) {//resultValidation es un objeto literal con propiedad "errors" y esa propiedad errors es el array (esto luego de hacer el mapped)
            return res.render('register', {
                errors: resultValidation.mapped(),//resultValiation es un array que tiene muchas cosas y no me interesa pasarlo con todo, por lo que uso el metodo "mapped"
                //el metodo mapped va a convertir el array de resultValidation en un objeto literal en donde cada obeto literal va a tener muchas propiedades
                //para probar se puede hacer: return res.send(resultValidation.mapped())
                oldData: req.body//esto es para la persistencia de DATOS.
            })
        }
        //........VALIDACIÓN PROPIA PARA VER SI EL USUARIO YA ESTá REGISTRADO EN LA BASE DE DATOS.................................///
        //antes de crear un usuario voy a chequear el campo mail para que no se repita. Verificar si el usuario existe.Buscar un usuario a traves del mail
        let userInDB = User.findByField('email', req.body.email);
        //return res.send(userInDB)//te muestra la info de la base de datos, no del nuevo intento de registro.
        if (userInDB) {
            return res.render('register', {
                errors: {//tomar mismo formato de los errores de Express Validator
                    email: {
                        msg: 'Este email ya está registrado'
                    }
                },
                oldData: req.body//importante para que mantenga la información que se registró previamente.
            });
        }



        //PROBAR QUE TRAE EL REQ.BODY Y EL REQ.FILE
        //console.log(req.body, req.file)

        //User.create(req.body)
        let UserToCreate = {
            // ...req.body,//todo lo que trajo el BODY en su REQUEST. 
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            avatar: req.file.filename//MULTER ME DEJA EN REQUEST UNA PROPIEDAD QUE SE LLAMA FILE, Y DENTRO DE FILE NECESITO LA PROPIEDAD FILENAME.
        }
        // User.create(UserToCreate)
        let userCreated = User.create(UserToCreate);
        //return res.send('Las validaciones se pasaron y no hay errores')
        return res.redirect('/users/login')

    },
    //................................................LOGIN........................................................//
    login: (req, res) => {
        //  console.log(req.session)//para prueba el console.log(req.) siempre antes del return
        // console.log(req.cookies)se ve en consola todo el contenido.
        // console.log(req.cookies.testing)//cookies objeto literal. LEO LA COOKIE en formulario de LOGIN(cookies en plural).En formulario de REGISTRO la SETEO(cuando seteo lo hago de a una, seteo una cookie).
        return res.render('login')
    },

    processLogin: (req, res) => {
        //interesa saber que viaja en el body del request y ver si ese usuario está registrado.									
        // console.log(req.body)									
        // return res.send( req.body)									

        // return res.send(req.body)//en URL muestro el RECORDAR, cuando marco recordar, esto viaja en el BODY; atraves del SEND, recuerda mi usuario y contraseña, llega con el name de Formulario de Login
        //return console.log(req.body)en consola muestro el RECORDAR, lo mismo que en el SEND anterior.
        console.log(req.body.email)
        let userToLogin = User.findByField('email', req.body.email);
        // return res.send(userToLogin)

        if (userToLogin) {
            //return res.send(userToLogin)

            let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);//1ero texto plano saco el body que viene en request y lo 2do lo que está en base de datos
            if (isOkThePassword) {
                //res.send('ok se puede ingresar')

                delete userToLogin.password;//borro de userToLogin la propiedad password
                req.session.userLogged = userToLogin;//genero en el session una propiedad que se llama userLogged

                if (req.body.remember) {//si no viene, no pasa nada, da undefined. No trae nada.
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) })//en el response seteo una cookie.
                }
                /* if (req.body.remember) {//si no viene, no pasa nada, da undefined. No trae nada.
                     res.cookie('userPassword', req.body.password, { maxAge: (1000 * 60) * 60 })//en el response seteo una cookie.
                 }*/
                return res.redirect('/users/profile');
            }
            return res.render('login', {
                errors: {
                    email: {
                        msg: 'Las credenciales son inválidas'
                    }
                }
            });
        }

        return res.render('login', {
            errors: {
                email: {
                    msg: 'No se encuentra este email en nuestra base de datos'
                }
            }
        });
    },

    //................................................PROFILE........................................................//
    profile: (req, res) => {
        // console.log('pasando por profile')
        // console.log(req.session)

        //sesion la tengo disponible en cualquier vista porque es una variable que se comparte a lo largo de toda la aplicación

        //request de la cookie creada. Cuando las quiero obtener viajan por el request y son cookies.
        console.log(req.cookies.userEmail)//me trae en consola luego de presionar el RECORDAR la info respectiva=> email
        // console.log(req.cookies.userPassword)//me trae en consola luego de presionar el RECORDAR la info respectiva=> password

        return res.render('profile', {
            user: req.session.userLogged
        })
    },
    logout: (req, res) => {
        res.clearCookie('userEmail')//debo destruir la cookie al salir, al hacer logout.
        req.session.destroy()//destroy lo que hace es borrar todo lo que esta en session, lo destruye.
        console.log(req.session)
        return res.redirect('/')
    }

}

module.exports = controller;