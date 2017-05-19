module.exports = function(sequelize,DataTypes){
	var Stock = sequelize.define("Stock", {
		company: {
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
};