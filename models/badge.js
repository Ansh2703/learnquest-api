const { DataTypes } = require('sequelize');

// This blueprint defines our 'Badges' table.
module.exports = (sequelize) => {
  const Badge = sequelize.define('Badge', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING, // We can store an icon name or URL here later.
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  });

  return Badge;
};
