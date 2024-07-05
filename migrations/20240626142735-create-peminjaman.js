'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Peminjamans', {
      id_peminjaman: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_peminjam: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Peminjams',
          key: 'id_peminjam'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_admin: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
          key: 'id_admin'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tanggal_pengajuan: {
        type: Sequelize.DATEONLY
      },
      alasan_peminjaman: {
        type: Sequelize.STRING
      },
      tanggal_keputusan: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status_peminjaman: {
        type: Sequelize.ENUM('Menunggu', 'Diterima', 'Ditolak', 'Selesai'),
        defaultValue: 'Menunggu'
      },
      alasan_penolakan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tanggal_pengembalian: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Peminjamans');
  }
};