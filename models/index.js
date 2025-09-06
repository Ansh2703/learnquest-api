const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Loading all our models, including the new ones for badges.
db.users = require('./user.js')(sequelize);
db.courses = require('./course.js')(sequelize);
db.lessons = require('./lesson.js')(sequelize);
db.userProgress = require('./userProgress.js')(sequelize);
db.badges = require('./badge.js')(sequelize); 
db.userBadges = require('./userBadge.js')(sequelize);

// --- Defining all relationships ---

// A Course has many Lessons.
db.courses.hasMany(db.lessons, { foreignKey: 'courseId' });
db.lessons.belongsTo(db.courses, { foreignKey: 'courseId' });

// A User can complete many Lessons (through the UserProgress table).
db.users.belongsToMany(db.lessons, { through: db.userProgress });
db.lessons.belongsToMany(db.users, { through: db.userProgress });

// --- NEW: Badge relationships ---
// A User can have many Badges (through the UserBadges table).
db.users.belongsToMany(db.badges, { through: db.userBadges });
// A Badge can be earned by many Users (through the UserBadges table).
db.badges.belongsToMany(db.users, { through: db.userBadges });

// This command syncs our database, creating the new tables if they don't exist.
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Success! Database and all tables have been synced.');
  });

module.exports = db;