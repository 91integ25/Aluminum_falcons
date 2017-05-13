module.exports = function(sequelize,DataTypes){
	var stocks = sequelize.define('stock', {
	 userName: {
	 	type: DataTypes.STRING
	 },
	 ticker: {
	 	type: DataTypes.STRING
	 }, 
	 purchase: {
	 	type: DataTypes.BOOLEAN,
	 	defaultValue: false
	 }
});
	return stocks;
}