//hago un middleware a nivel ruta.
//preguntar si tengo a alguien en session y si tengo a alguien, lo mando al login

function guestMiddleware (req, res, next){
    if (req.session.userLogged) {
		return res.redirect('/users/profile');
	}
	next();//si no tengo a nadie en sesion, quiero el proceso el request siga con la cadena de peticiones. Que se siga el proceso.
}

module.exports = guestMiddleware