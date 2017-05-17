module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6,30]
      },
      unique: true
    },
    loggedIn:{
    	type:DataTypes.BOOLEAN,
    	defaultValue:false
    },
    email: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return User;
};