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
  },{   classMethods: {
        associate: function(models) {
          // Associating Author with Posts
          // When an Author is deleted, also delete any associated Posts
          User.hasMany(models.Stock, {
            onDelete: "cascade"
          });
        }
      }
    }
);
  return User;
};