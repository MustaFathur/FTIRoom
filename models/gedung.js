'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gedung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Gedung.hasMany(models.Ruangan, {
        foreignKey: 'id_gedung',
        as: 'ruangans'
      })
    }
  }
  Gedung.init({
    id_gedung: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_gedung: DataTypes.STRING,
    alamat: DataTypes.STRING,
    gambar_gedung: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Gedung',
  });
  return Gedung;
};