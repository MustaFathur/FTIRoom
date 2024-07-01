'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Peminjaman.belongsTo(models.Peminjam, {
        foreignKey: 'id_peminjam',
        as: 'peminjam'
      }),
      Peminjaman.belongsTo(models.Admin, {
        foreignKey: 'id_admin',
        as: 'admin'
      })
      Peminjaman.hasMany(models.DetailPeminjaman, {
        foreignKey: 'id_peminjaman',
        as: 'peminjaman'
      })
    }
  }
  Peminjaman.init({
    id_peminjam: DataTypes.INTEGER,
    id_admin: DataTypes.INTEGER,
    tanggal_pengajuan: DataTypes.DATE,
    alasan_peminjaman: DataTypes.STRING,
    tanggal_keputusan: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status_peminjaman: DataTypes.ENUM('Menunggu', 'Diterima', 'Ditolak'),
    alasan_penolakan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_pengembalian: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Peminjaman',
  });
  return Peminjaman;
};