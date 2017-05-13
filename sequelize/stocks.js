var Sequelize = require('sequelize')
var db = new Sequelize('stocks', 'my_username', 'my_password', {
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
	 ticker: {
	 	type: Sequelize.STRING
	 }, 
	 purchase: {
	 	type: Sequelize.BOOLEAN,
	 	defaultValue: false
	 }
})

Post.sync().then(function() {
	var data = {
		userName: 'This test',
		ticker: 'QQQ',
		purchase: true
	}

Post.create(data).then(function(post) {
		console.dir(post.get())
	})
})
