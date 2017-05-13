module.exports = function(sequelize,DataTypes){
	var Stock = sequelize.define('Stock', {
	 stockName:{
	 	type: DataTypes.INTEGER,
	 	allowNull:false,
	 	validate:{
	 		len:[1]
	 	}
	 },
	 ticker: {
	 	type: DataTypes.STRING
	 }
	},{
	 	classMethods:{
	 		associate:function(models){
	 			Stock.belongsTo(models.User,{
	 				onDelete:"CASCADE",
	 				foreignKey:{
	 					allowNull:false
	 				}
	 			})
	 		}
	 	}
	});
	return Stock;
}