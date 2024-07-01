'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ruangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ruangan.belongsTo(models.Gedung, {
        foreignKey: 'id_gedung',
        as: 'gedung'
      }),
      Ruangan.hasMany(models.DetailPeminjaman, {
        foreignKey: 'id_ruangan',
        as: 'ruangan'
      })
    }
  }
  Ruangan.init({
    id_ruangan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_gedung: DataTypes.INTEGER,
    nama_ruangan: DataTypes.STRING,
    kapasitas: DataTypes.INTEGER,
    fasilitas: DataTypes.STRING,
    gambar_ruangan: DataTypes.STRING,
    status_ketersediaan: DataTypes.ENUM('Tersedia', 'Dipinjam')
  }, {
    sequelize,
    modelName: 'Ruangan',
  });
  return Ruangan;
};