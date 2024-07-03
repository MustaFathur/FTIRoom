var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
const {authMiddleware, roleMiddleware, } = require('../middlewares/auth');

router.get('/home', authMiddleware, roleMiddleware('peminjam'), user.home);
router.get('/profil', authMiddleware, roleMiddleware('peminjam'), user.profil);
router.get('/profil/ubah-data', authMiddleware, roleMiddleware('peminjam'), user.ubahProfilForm);
router.post('/profil/ubah-data', authMiddleware, roleMiddleware('peminjam'), user.ubahProfil);
router.get('/ubah-password', authMiddleware, roleMiddleware('peminjam'), user.ubahPasswordForm)
router.post('/ubah-password', authMiddleware, roleMiddleware('peminjam'), user.ubahPassword)

router.get('/daftar-gedung', authMiddleware, roleMiddleware('peminjam'), user.daftarGedung);
router.get('/detail-gedung:id_gedung');

router.get('/daftar-ruangan/:id_gedung', authMiddleware, roleMiddleware('peminjam'), user.daftarRuangan);
router.get('/pinjam-ruangan', authMiddleware, roleMiddleware('peminjam'), user.pinjamRuanganForm);
router.post('/pinjam-ruangan', authMiddleware, roleMiddleware('peminjam'), user.pinjamRuangan);
router.get('/pinjam-ruangan/:id_ruangan', authMiddleware, roleMiddleware('peminjam'), user.pinjamRuanganFormById);
router.post('/pinjam-ruangan/:id_ruangan', authMiddleware, roleMiddleware('peminjam'), user.pinjamRuanganById);

router.get('/data-peminjaman', authMiddleware, roleMiddleware('peminjam'), user.dataPeminjaman);
router.get('/detail-peminjaman/:id_peminjaman');
router.post('/batal-peminjaman/:id_peminjaman', authMiddleware, roleMiddleware('peminjam'), user.batalPeminjaman)
router.post('/selesai-peminjaman/:id_peminjaman', authMiddleware, roleMiddleware('peminjam'), user.selesaiPeminjaman)
router.get('/riwayat-peminjaman', authMiddleware, roleMiddleware('peminjam'), user.riwayatPeminjaman)

module.exports = router;
