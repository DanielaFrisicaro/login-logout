//1. Guardar al usuario en la DB
//2. Buscar al usuario que se quiere loguear por su email
//3. Buscar a un usuario por su ID
//4. Editar la información de un usuario
//5. Eliminar a un usuario de la DB

//Hacer un objeto literal que va a tener metodos que se va a encargar de estas caracteristicas del CRUD

const fs = require('fs');
//const usuario = require('../database/users.json'). Prueba del path.
const User = {
	fileName: './database/users.json',

	getData: function () {
		return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
	},
    
	generateId: function () {
		let allUsers = this.findAll();
		let lastUser = allUsers.pop();
		if (lastUser) {
			return lastUser.id + 1;
		}
		return 1;
	},

	findAll: function () {
		return this.getData();
	},

	findByPk: function (id) {
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser.id === id);
		return userFound;
	},

	findByField: function (field, text) {//va a traer el 1ero que encuentre, en caso de haber muchos.
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser[field] === text);
		return userFound;
	},

    //el ID es lo unico que no viene del formulario, debe venir generado del Modelo.
	create: function (userData) {
		let allUsers = this.findAll();
		let newUser = {
			id: this.generateId(),
			...userData
		}
		allUsers.push(newUser);
		fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null,  ' '));
		return newUser;
	},

	delete: function (id) {
		let allUsers = this.findAll();
		let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
		fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));
		return true;
	}
}



module.exports = User;

//probar: node models/Users.js
/*console.log(User.getData())
console.log(User.findAll())
console.log(User.findByPk(2))
console.log(User.findByField('email', 'maria@toyota.com'))
console.log(User.create({name: 'Daniela', email:'maria@toyota.com'}))
console.log(User.generateId())
console.log(User.delete(3))*/