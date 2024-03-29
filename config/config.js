const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "usersdbsequelize",
  process.env.MYSQL_LOGIN,
  process.env.MYSQL_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const Posts = sequelize.define(
  "posts",
  {
    uuid: {
      primaryKey: true,
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  },
  { timestamps: false }
);

const User = sequelize.define(
  "users",
  {
    uuid: {
      primaryKey: true,
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: true, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    age: { type: DataTypes.INTEGER, allowNull: false },
    secret_word: { type: DataTypes.STRING, allowNull: false },
    rolesUser: { type: DataTypes.STRING, allowNull: false },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: `/images/defaultAvatar.png`,
    },
  },
  { timestamps: false }
);

const Role = sequelize.define(
  "roles",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = { sequelize, Posts, User, Role };
