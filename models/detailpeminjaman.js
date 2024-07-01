'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailPeminjaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailPeminjaman.belongsTo(models.Ruangan, {
        foreignKey: 'id_ruangan',
        as: 'ruangan'
      })
      DetailPeminjaman.belongsTo(models.Peminjaman, {
        foreignKey: 'id_peminjaman',
        as: 'peminjaman'
      })
    }
  }
  DetailPeminjaman.init({
    id_peminjaman: DataTypes.INTEGER,
    id_ruangan: DataTypes.INTEGER,
    tanggal_peminjaman: DataTypes.DATE,
    jam_mulai: DataTypes.TIME,
    jam_selesai: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'DetailPeminjaman',
  });
  return DetailPeminjaman;
};