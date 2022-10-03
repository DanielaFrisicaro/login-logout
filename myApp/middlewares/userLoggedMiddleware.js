//este es un middleware de aplicación. Lo llamo en app.js.
//lo necesitamos en todo el sistema.
//elijo que mostrar en navbar y que no según esté logueado o no.

const User= require('../models/Users')//traigo al Modelo para hacer un findByField y encontrar las Cookies.

function userLoggedMiddleware(req, res, next) {

    // console.log('pasando por el MD de logged')
    res.locals.isLogged = false;//req.locals variables que puedo compartir en todas las vistas indistintamente del controlador.

    //en este caso en un middleware de aplicacion, toda la aplicacion va a conoer de esta variable islogged en este caso.

    ///si tengo a alguien en la cookie, lo busco llamando la DB, y lo paso a session.///
    let emailInCookie = req.cookies.userEmail;//en esta cookie existe el usuario. Pero ademas me interea buscar el usuario, por lo que voy a llamar a la Base de datos, al Modelo en este caso.
    //  console.log(emailInCookie)Prueba
    let userFromCookie = User.findByField('email', emailInCookie);
   // console.log(userFromCookie)
    if (userFromCookie) {
        req.session.userLogged = userFromCookie;
    }


    //como paso la cookie a session, posiblemente en algun momento la cookie caducó pero como ya está pasado a Session, ya no importa.
   //si cierro sesion, se sigue logueado, la cookie se destruyó pero se sigue logueado.
    if (req.session && req.session.userLogged) {//si es verdad hay alguien logueado, de lo contrario da undefined.
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged;//paso informacion a nivel aplicación para que se consuma en muchas vistas, no estoy redirigiendo a una vista puntual.
        //paso variables locales para que puedan ser compartidas en distintas vistas NO estoy renderizando una vista, esa vista necesito que sepa que tiene algo en variables locales.
        //paso lo que tengo en session a una variable local.
    }

    next();
}

module.exports = userLoggedMiddleware;