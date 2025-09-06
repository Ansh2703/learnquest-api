const { DataTypes } = require('sequelize');

// This blueprint defines our 'Lessons' table.
module.exports = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
    // The 'title' of the individual lesson.
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The 'content' of the lesson. For a video, this could be a YouTube link.
    // For a quiz, it could be the quiz questions in a special format.
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // We'll add a 'lessonType' to know if it's a video or a quiz.
    lessonType: {
        type: DataTypes.STRING, // Will store either 'video' or 'quiz'
        defaultValue: 'video'
    }
  });

  return Lesson;
};
