const { Sequelize } = require('sequelize');
require('dotenv').config();

// This is the main connection setup.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // We need the port here
    dialect: 'mysql',
    // --- THIS IS THE CRUCIAL NEW PART ---
    // This tells Sequelize to use an encrypted connection.
    dialectOptions: {
      ssl: {
        // This is not strictly required by Railway, but it's good practice.
        // It tells the connection to fail if the certificate is invalid.
        rejectUnauthorized: true 
      }
    }
  }
);

// The rest of your file (loading models, defining relationships) remains the same.
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.js')(sequelize);
db.courses = require('./course.js')(sequelize);
db.lessons = require('./lesson.js')(sequelize);
db.userProgress = require('./userProgress.js')(sequelize);
db.badges = require('./badge.js')(sequelize);
db.userBadges = require('./userBadge.js')(sequelize);

// Defining all relationships
db.courses.hasMany(db.lessons, { foreignKey: 'courseId' });
db.lessons.belongsTo(db.courses, { foreignKey: 'courseId' });
db.users.belongsToMany(db.lessons, { through: db.userProgress });
db.lessons.belongsToMany(db.users, { through: db.userProgress });
db.users.belongsToMany(db.badges, { through: db.userBadges });
db.badges.belongsToMany(db.users, { through: db.userBadges });

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Success! Database and all tables have been synced.');
  });

module.exports = db;