const { DataTypes } = require('sequelize');

// This blueprint is for our 'Courses' table.
module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    // The 'title' column for the course name.
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // A 'description' to tell users what the course is about.
    description: {
      type: DataTypes.TEXT // TEXT is good for longer descriptions.
    }
  });

  return Course;
};
