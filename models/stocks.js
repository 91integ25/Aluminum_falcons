module.exports = function(sequelize,DataTypes){
	var stock = sequelize.define('stock', {
	 stockName:{
	 	type: DataTypes.NUMBER
	 },
	 ticker: {
	 	type: DataTypes.STRING
	 }
});
	return stock;
}