"use strict";

import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import configuration from "../config/config";
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = configuration[env];
const db = {};

let sequelize;

sequelize = new Sequelize(config.url, config);

readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
