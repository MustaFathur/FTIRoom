const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin');
const {authMiddleware, roleMiddleware, } = require('../middlewares/auth');
const upload = require('../config/multer');

router.get('/dashboard', authMiddleware, roleMiddleware('admin'), admin.dashboard);

router.get('/daftar-gedung', authMiddleware, roleMiddleware('admin'), admin.daftarGedung);
router.get('/tambah-gedung', authMiddleware, roleMiddleware('admin'), admin.tambahGedungForm);
router.post('/tambah-gedung', authMiddleware, roleMiddleware('admin'), upload.single('gambar_gedung'), admin.tambahGedung);
router.get('/detail-gedung/:id_gedung', authMiddleware, roleMiddleware('admin'), admin.detailGedung);
router.get('/edit-gedung/:id_gedung', authMiddleware, roleMiddleware('admin'), admin.editGedungForm);
router.post('/edit-gedung/:id_gedung', authMiddleware, roleMiddleware('admin'), upload.single('gambar_gedung'), admin.editGedung);
router.post('/delete-gedung/:id_gedung', authMiddleware, roleMiddleware('admin'), admin.deleteGedung);

router.get('/daftar-ruangan/:id_gedung', authMiddleware, roleMiddleware('admin'), admin.daftarRuangan);
router.get('/tambah-ruangan/:id_gedung', authMiddleware, roleMiddleware('admin'), admin.tambahRuanganForm);
router.post('/tambah-ruangan/:id_gedung', authMiddleware, roleMiddleware('admin'), upload.single('gambar_ruangan'), admin.tambahRuangan);
router.get('/detail-ruangan/:id_ruangan', authMiddleware, roleMiddleware('admin'), admin.detailRuangan);
router.get('/edit-ruangan/:id_ruangan', authMiddleware, roleMiddleware('admin'), admin.editRuanganForm);
router.post('/edit-ruangan/:id_ruangan', authMiddleware, roleMiddleware('admin'), upload.single('gambar_ruangan'), admin.editRuangan);
router.post('/delete-ruangan/:id_ruangan', authMiddleware, roleMiddleware('admin'), admin.deleteRuangan);

router.get('/daftar-peminjaman', authMiddleware, roleMiddleware('admin'), admin.daftarPeminjaman)
router.post('/terima-peminjaman/:id_peminjaman', authMiddleware, roleMiddleware('admin'), admin.terimaPeminjaman);
router.post('/tolak-peminjaman/:id_peminjaman', authMiddleware, roleMiddleware('admin'), admin.tolakPeminjaman);
router.get('/rekap-peminjaman', authMiddleware, roleMiddleware('admin'), admin.rekapPeminjaman)

module.exports = router;