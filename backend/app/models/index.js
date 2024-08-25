const Sequelize = require("sequelize");
const config = require("../config/db");

// Initialize Sequelize
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

// Define database object
const db = {};

// Define User model
db.User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  digits: {
    type: Sequelize.STRING(155),
    allowNull: true,
    unique: true,
  },
  fotoUrl: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  workType: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  positionTitle: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  lon: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  company: {
    type: Sequelize.STRING(155),
    allowNull: true,
  },
  isLogin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  dovote: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  dosurvey: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  dofeedback: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  fullname: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  cuurentLeave: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'users',
});

// Define Survey model
db.Survey = sequelize.define('Survey', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  values: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: db.User,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'surveys',
});

// Define Attack model
db.Attack = sequelize.define('Attack', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sourcecountry: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  destinationcountry: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  millisecond: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  type: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  weight: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  attacktime: {
    type: Sequelize.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'attacks',
});

// Define Role model
db.Role = sequelize.define('Role', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
  tableName: 'roles',
});

// Define UserRole model
db.UserRole = sequelize.define('UserRole', {
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: db.User,
      key: 'id',
    },
  },
  roleId: {
    type: Sequelize.INTEGER,
    references: {
      model: db.Role,
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'user_roles',
});

// Define relationships
db.User.belongsToMany(db.Role, { through: db.UserRole, foreignKey: 'userId' });
db.Role.belongsToMany(db.User, { through: db.UserRole, foreignKey: 'roleId' });
db.Survey.belongsTo(db.User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(error => {
    console.error('Error synchronizing database:', error);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;