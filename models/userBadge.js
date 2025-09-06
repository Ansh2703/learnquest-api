// This is another simple 'join table'.
// It will connect a user to a badge they have earned.
module.exports = (sequelize) => {
  const UserBadge = sequelize.define('UserBadge', {});
  return UserBadge;
};
