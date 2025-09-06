// This model is a simple 'join table'.
// It connects a user to a lesson they have completed.
module.exports = (sequelize) => {
  const UserProgress = sequelize.define('UserProgress', {
    // We don't need many columns here. The important information
    // will be the 'userId' and 'lessonId', which Sequelize
    // will add automatically when we define the relationships.
  });

  return UserProgress;
};

