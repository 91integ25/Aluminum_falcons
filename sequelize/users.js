var Sequelize = require('sequelize')
var db = new Sequelize('users', 'robzter', 'Roberto1', {
	dialect: 'mysql'
})

var Post = db.define('post', {
	 id: {
	 	type: Sequelize.INTEGER,
	 	primaryKey: true,
	 	autoIncrement: true
	 },
	 userName: {
	 	type: Sequelize.STRING
	 },
	 email: {
	 	type: Sequelize.STRING
	 }, 
	 password: {
	 	type: Sequelize.STRING
	 }
})

Post.sync().then(function() {
	var data = {
		userName: 'This test',
		email: 'email@gmail.com',
		password: 'HeyYo'
	}

Post.create(data).then(function(post) {
		console.dir(post.get())
	})
})