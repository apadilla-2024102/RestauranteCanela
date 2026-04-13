const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/restaurant_db', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Restaurant = require('./Restaurant')(sequelize, Sequelize);
db.MenuItem = require('./MenuItem')(sequelize, Sequelize);
db.Reservation = require('./Reservation')(sequelize, Sequelize);
db.Table = require('./Table')(sequelize, Sequelize);
db.Cart = require('./Cart')(sequelize, Sequelize);
db.Order = require('./Order')(sequelize, Sequelize);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize);
db.Promotion = require('./Promotion')(sequelize, Sequelize);
db.Review = require('./Review')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize);
db.Mission = require('./Mission')(sequelize, Sequelize);

// Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;