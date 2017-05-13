module.exports = function(sequelize,DataTypes){
	var user = db.define('user', {
	 userName: {
	 	type: DataTypes.STRING
	 },
	 email: {
	 	type: DataTypes.STRING
	 }, 
	 password: {
	 	type: DataTypes.STRING
	 }
});
	return user;
}