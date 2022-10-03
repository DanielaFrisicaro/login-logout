
function authMiddleware (req, res, next){
    if (!req.session.userLogged) {
		return res.redirect('/users/login');//se puede enviar al login o al register.
	}
	next();//si si tengo a alguien en sesion, quiero el proceso el request siga con la cadena de peticiones. Que se siga el proceso. Que siga al siguiente controlador.
    //va a ser middleware de ruta tambien pero solo va a estar en Profile.
}

module.exports = authMiddleware