'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peminjam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Peminjam.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user'
    }),
    Peminjam.hasMany(models.Peminjaman, {
      foreignKey: 'id_peminjam',
      as: 'peminjam'
    })
    }
  }
  Peminjam.init({
    id_peminjam: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATE,
    gender: DataTypes.STRING,
    jurusan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Peminjam',
  });
  return Peminjam;
};