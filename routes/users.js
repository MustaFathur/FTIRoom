var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
const {authMiddleware, roleMiddleware, } = require('../middlewares/auth');

router.get('/home', authMiddleware, roleMiddleware('peminjam'), user.home);
router.get('/profile')
router.post('/ganti-password')

router.get('/daftar-gedung', authMiddleware, roleMiddleware('peminjam'), user.daftarGedung);
router.get('/detail-gedung:id_gedung');

router.get('/daftar-ruangan/:id_gedung', authMiddleware, roleMiddleware('peminjam'), user.daftarRuangan);
router.get('/detail-ruangan/:id_ruangan');

router.get('/data-peminjaman');
router.get('/detail-peminjaman/:id_peminjaman')
router.get('/pinjam-ruangan/:id_ruangan');
router.post('/pinjam-ruangan/:id_ruangan');
router.post('/batal-peminjaman/:id_peminjaman')
router.get('/riwayat-peminjaman')

module.exports = router;
