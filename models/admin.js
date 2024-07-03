'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user'
      }),
      Admin.hasMany(models.Peminjaman, {
        foreignKey: 'id_admin',
        as: 'peminjamans'
      }
      )
    }
  }
  Admin.init({
    id_admin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};