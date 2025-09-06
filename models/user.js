// This file will define the structure of our 'Users' table in the database.

// We need to tell Node.js that we're using Sequelize's datatypes.
const { DataTypes } = require('sequelize');

// We're defining a function that will create the model.
// It takes two arguments: 'sequelize' (our database connection) and 'DataTypes'.
module.exports = (sequelize) => {
  // We use the 'define' method from Sequelize to create our model.
  // The first argument, 'User', will be the name of our model.
  // Sequelize will automatically make the table name plural ('Users').
  const User = sequelize.define('User', {
    // Here we define the columns for our table.

    // The 'username' column.
    username: {
      type: DataTypes.STRING, // It will store text.
      allowNull: false,       // It must have a value.
      unique: true            // No two users can have the same username.
    },

    // The 'email' column.
    email: {
      type: DataTypes.STRING,
      allowNull: false,

      unique: true
    },

    // The 'password' column.
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The 'points' column for our gamification.
    points: {
      type: DataTypes.INTEGER, // It will store a whole number.
      defaultValue: 0          // New users will start with 0 points.
    }
  });

  // Finally, we return the newly defined model.
  return User;
};

