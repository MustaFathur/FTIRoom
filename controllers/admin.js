const { where } = require('sequelize');
const {Gedung, Ruangan} = require('../models')
const upload = require('multer');   

const dashboard = async (req, res) => {

    const gedungs = await Gedung.findAll();
    res.render('Admin/dashboard', {tittle: 'Dashboard', currentPage: 'dashboard', gedungs})
}

const daftarGedung = async (req, res, next) => {
    try {
        const gedungs = await Gedung.findAll();
        const totalGedung = await Gedung.count();

        res.render('Admin/daftar-gedung', {tittle: 'Daftar Gedung', currentPage: 'daftar-gedung', gedungs, totalGedung})

    } catch {

    }
}

const tambahGedungForm = async (req, res, next) => {
    try {

        res.render('Admin/tambah-gedung', {tittle: 'Tambah Gedung', currentPage:'daftar-gedung'})

    } catch {

    }
}

const tambahGedung = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        console.log("File:", req.file);
        const { nama_gedung, alamat } = req.body;
        const gambar_gedung = req.file;

        if (!nama_gedung || !alamat) {
            return res.status(400).json({ message: 'Nama gedung dan alamat wajib diisi' });
        }

        if (!gambar_gedung) {
            return res.status(400).json({ message: 'Gambar wajib diisi' });
        }

        const imageFileName = gambar_gedung.filename;

        const findGedung = await Gedung.findOne({ where: { nama_gedung } });
        if (findGedung) {
            return res.status(400).json({ message: 'Nama gedung sudah digunakan' });
        }

        await Gedung.create({
            nama_gedung,
            alamat,
            gambar_gedung: imageFileName,
        });

        res.status(201).json({ message: 'Gedung berhasil ditambahkan', data: { nama_gedung, alamat, gambar: imageFileName } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambah gedung' });
    }
};

const detailGedung = async (req, res, next) => {
    
    const {id_gedung} = req.params;
    const gedung = await Gedung.findOne({where: {id_gedung}});

    if(!gedung) {
        return res.status(404).json({ message: 'Gedung tidak ditemukan' })
    }

    res.render('Admin/detail-gedung', {tittle: 'Detail Gedung', currentPage: 'daftar-gedung', gedung})
}

const editGedungForm = async (req, res, next) => {
    
    const {id_gedung} = req.params;
    const gedung = await Gedung.findOne({where: {id_gedung}});

    if(!gedung) {
        return res.status(404).json({ message: 'Gedung tidak ditemukan' })
    }

    res.render('Admin/edit-gedung', {tittle: 'Edit Gedung', currentPage: 'daftar-gedung', gedung});
}

const editGedung = async (req, res, next) => {

    const {id_gedung} = req.params;

    const nama_gedung = req.body.nama_gedung;
    const alamat = req.body.alamat;
    const gambar_gedung = req.file

    if(!gambar_gedung) {
        return res.status(404).json({ message: 'Gambar harus diunggah!' });
    }

    const imageFileName = gambar_gedung.filename;
    const pathImageFile = `uploads/gedung/${imageFileName}`;
    console.log(pathImageFile);

    try {
        if(!nama_gedung || !alamat || !gambar_gedung) {
            return res.status(404).json({ message: 'Semua field harus diisi!' });
        }

        const gedung = await Gedung.findOne({ where: {id_gedung} })

        if(!gedung) {
            return res.status(404).json({message: 'Gedung tidak ditemukan'});
        }

        gedung.nama_gedung = nama_gedung;
        gedung.alamat = alamat;
        gedung.gambar_gedung = imageFileName;

        await gedung.save();

        return res.redirect('/admin/daftar-gedung');

    } catch (error) {
        console.error('Error updating gedung:', error);
        return res.status(500).json({ message: 'Gagal mengupdate gedung!', error: error.message });
    }
}

const deleteGedung = async (req, res, next) => {
    const {id_gedung} = req.params;

    try {
        const gedung = await Gedung.findOne({ where: {id_gedung} })

        if(!gedung) {
            return res.status(404).json({message: 'Gedung tidak ditemukan'})
        }

        await gedung.destroy();

        return res.redirect('/admin/daftar-gedung');
    
    } catch (error) {
        next(error);
    }
}


const daftarRuangan = async (req, res, next) => {
    try {
        const {id_gedung} = req.params;
        const gedung = await Gedung.findOne({ where: {id_gedung} });
        const gedungs = await Gedung.findAll();
        const ruangans = await Ruangan.findAll({ where: {id_gedung} });

        res.render('Admin/daftar-ruangan', {tittle: 'Daftar Ruangan', currentPage: 'daftar-ruangan', gedung, gedungs, ruangans})
    } catch (error) {
        next (error)
    }
}

const tambahRuanganForm = async (req, res, next) => {
    try {
        const {id_gedung} = req.params;
        const gedung = await Gedung.findByPk(id_gedung);
        const gedungs = await Gedung.findAll();

        if (!gedung) {
            return res.status(404).json({ message: 'Gedung tidak ditemukan' });
        }

        res.render('Admin/tambah-ruangan', {tittle: 'Tambah Ruangan', currentPage:'daftar-ruangan', gedung, gedungs})

    } catch (error) {
        next(error)
    }
} 

const tambahRuangan = async (req, res, next) => {
    try {
        const {id_gedung} = req.params;
        const {nama_ruangan, kapasitas, fasilitas} = req.body;
        const gambar_ruangan = req.file;

        if(!nama_ruangan || !kapasitas || !fasilitas || !gambar_ruangan) {
            return res.status(400).json({ message: 'Semua field harus diisi!' });
        }

        const imageFileName = gambar_ruangan.filename;

        await Ruangan.create({
            nama_ruangan,
            kapasitas,
            fasilitas,
            gambar_ruangan: imageFileName,
            status_ketersediaan: 'Tersedia',
            id_gedung
        });

        res.redirect(`/admin/daftar-ruangan/${id_gedung}`);
    
    } catch (error) {
        next(error)
    }
}

const detailRuangan = async (req, res, next) => {
        
    const {id_ruangan} = req.params;
    const ruangan = await Ruangan.findOne({where: {id_ruangan}});
    const gedungs = await Gedung.findAll();

    if(!ruangan) {
        return res.status(404).json({ message: 'Ruangan tidak ditemukan' })
    }

    res.render('Admin/detail-ruangan', {tittle: 'Detail Ruangan', currentPage: 'daftar-ruangan', ruangan, gedungs})
}

const editRuanganForm = async (req, res) => {
    try {
      const { id_ruangan } = req.params;
      const ruangan = await Ruangan.findOne({ where: { id_ruangan } });
      const gedungs = await Gedung.findAll();
  
      if (!ruangan) {
        return res.status(404).json({ message: 'Ruangan tidak ditemukan' });
      }
  
      res.render('Admin/edit-ruangan', { title: 'Edit Ruangan', ruangan, gedungs });
    } catch (error) {
      res.status(500).json({ message: 'Gagal memuat form edit ruangan' });
    }
};

const editRuangan = async (req, res) => {
    try {
      const { id_ruangan } = req.params;
      const { nama_ruangan, kapasitas, fasilitas, id_gedung } = req.body;
      const gambar_ruangan = req.file;
  
      if (!nama_ruangan || !kapasitas || !fasilitas || !id_gedung) {
        return res.status(400).json({ message: 'Semua field harus diisi!' });
      }
  
      const ruangan = await Ruangan.findOne({ where: { id_ruangan } });
  
      if (!ruangan) {
        return res.status(404).json({ message: 'Ruangan tidak ditemukan' });
      }
  
      ruangan.nama_ruangan = nama_ruangan;
      ruangan.kapasitas = kapasitas;
      ruangan.fasilitas = fasilitas;
      ruangan.id_gedung = id_gedung;
  
      if (gambar_ruangan) {
        ruangan.gambar = gambar_ruangan.filename;
      }
  
      await ruangan.save();
  
      res.redirect(`/admin/daftar-ruangan/${id_gedung}`);
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengupdate ruangan' });
    }
};

const deleteRuangan = async (req, res) => {
    try {
      const { id_ruangan } = req.params;
      const ruangan = await Ruangan.findOne({ where: { id_ruangan } });
  
      if (!ruangan) {
        return res.status(404).json({ message: 'Ruangan tidak ditemukan' });
      }
  
      await ruangan.destroy();
  
      res.redirect(`/admin/daftar-ruangan/${ruangan.id_gedung}`);
    } catch (error) {
      res.status(500).json({ message: 'Gagal menghapus ruangan' });
    }
};

module.exports = {
    dashboard,
    daftarGedung,
    tambahGedungForm,
    tambahGedung,
    detailGedung,
    editGedungForm,
    editGedung,
    deleteGedung,
    daftarRuangan,
    tambahRuanganForm,
    tambahRuangan,
    detailRuangan,
    editRuanganForm,
    editRuangan,
    deleteRuangan
}