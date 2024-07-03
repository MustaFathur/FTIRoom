const { Op, where } = require('sequelize');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {User, Peminjam, Gedung, Ruangan, Peminjaman, DetailPeminjaman, sequelize} = require('../models');
const gedung = require('../models/gedung');
const ruangan = require('../models/ruangan');
const user = require('../models/user');
const peminjaman = require('../models/peminjaman');

const home = (req, res) => {
    res.render('User/home', {title: 'Home'});
}

const profil = async (req, res, next) => {

    const id_user = req.session.user.id;
    const peminjam = await Peminjam.findOne(
        { 
            where: {id_user: id_user},
            
            include: [
                {
                model: User,
                as: 'user',
                attributes: ['username', 'email', 'no_hp']
                }
            ]
        }
    )

    res.render('User/profil', {title: 'Profil Pengguna', peminjam})
}

const ubahProfilForm = async (req, res, next) => {
    res.render('User/ubah-profil', {title: 'Ubah Profil'})
}

const ubahProfil = async (req, res, next) => {

    const id_user = req.session.user.id;
    const {nama, jurusan, tanggal_lahir, gender, alamat} = req.body;

    try{

        if(!id_user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        if(!nama || !jurusan || !tanggal_lahir || !gender || !alamat) {
            return res.status(404).json({ message: 'Semua field wajib diisi!' });
        }

        await Peminjam.update(
            {             
            nama: nama,
            jurusan: jurusan,
            tanggal_lahir: tanggal_lahir,
            gender: gender,
            alamat: alamat,
            },

            {where: {id_user: id_user}} 
        );

        return res.redirect('/profil');

    } catch (error) {
        next(error);
    }
}

const ubahPasswordForm = async (req, res, next) => {
    res.render('User/ubah-password', {title: 'Ubah Password'})
}

const ubahPassword = async (req, res, next) => {

    const id_user = req.session.user.id;
    const password = req.body.password;
    const passwordBaru = req.body.passwordBaru;
    const userData = await User.findOne({ where: {id: id_user} });
    
    try {

        if(!id_user) {
            return res.status(404).json({ message: 'User tidak ditemukan!' });
        }

        if(!password || !passwordBaru) {
            return res.status(404).json({ message: 'Semua field wajib diisi!' });
        }

        if(passwordBaru.length < 6) {
            return res.status(404).json({ message: 'Password harus memiliki minimal 6 karakter'});
        }

        if(!userData || !(await bcrypt.compare(password, userData.password))) {
            return res.status(404).json({ message: 'Password lama tidak valid!'});
        }

        if(await bcrypt.compare(passwordBaru, userData.password)) {
            return res.status(404).json({ message: 'Password baru harus berbeda dengan password lama!'});
        }

        const hashedPassword = await bcrypt.hash(passwordBaru, 12);

        await User.update({ password: hashedPassword}, { where: {id: id_user} });

        return res.redirect('/ubah-password');

    } catch (error) {
        next (error);
    }
}

const daftarGedung = async (req, res, next) => {

    const gedungs = await Gedung.findAll();

    res.render('User/daftar-gedung', {title: 'Daftar Gedung', gedungs})

}

const daftarRuangan = async (req, res, next) => {
    try {
        const {id_gedung} = req.params;
        const gedung = await Gedung.findByPk(id_gedung,
            {
                include: {
                    model: Ruangan,
                    as: 'ruangans'
                }
            }
        );

        if(!gedung) {
            return res.status(404).json({ message: 'Gedung tidak ditemukan' });
        }

        res.render('User/daftar-ruangan', {title: `Daftar Ruangan di ${gedung.nama_gedung}`, gedung, ruangans: gedung.ruangans})
    
    } catch (error) {
        next(error)
    } 
}

const pinjamRuanganForm = async (req, res, next) => {

    try {
        const ruangans = await Ruangan.findAll();

        res.render('User/pinjam-ruangan', {title: 'Pinjam Ruangan', ruangans});

    } catch (error) {
        next (error);
    }
} 

const pinjamRuangan = async (req, res, next) => {
    try {
        const { id_ruangan, alasan_peminjaman, tanggal_peminjaman, jam_mulai, jam_selesai } = req.body;
        const id_user = req.session.user.id;

        const peminjam = await Peminjam.findOne({ where: { id_user: id_user } });

        const newPeminjaman = await Peminjaman.create({
            id_peminjam: peminjam.id_peminjam,
            id_admin: null,
            tanggal_pengajuan: new Date().toISOString(),
            alasan_peminjaman: alasan_peminjaman,
            tanggal_keputusan: null,
            status_peminjaman: 'Menunggu',
            alasan_penolakan: null,
            tanggal_pengembalian: null
        });

        const newDetailPeminjaman = await DetailPeminjaman.create({
            id_peminjaman: newPeminjaman.id_peminjaman,
            id_ruangan: id_ruangan,
            tanggal_peminjaman,
            jam_mulai,
            jam_selesai
        });

        res.redirect('/data-peminjaman');
    } catch (error) {
        next(error);
    }
}

  

const pinjamRuanganFormById = async (req, res, next) => {

    const {id_ruangan} = req.params;
    const ruangan = await Ruangan.findOne(
        {
            where: {id_ruangan: id_ruangan},

            include: {
                model: Gedung,
                as: 'gedung'
            }

        }
    )

    try {
        if(!ruangan) {
            return res.status(404).json({ message: 'Ruangan tidak ditemukan' })      
        } else {
            res.render('User/pinjam-ruangan-id', {title: `Pinjam Ruangan ${ruangan.nama_ruangan}`, ruangan})
        }

    } catch (error) {
        next(error);
    }

}

const pinjamRuanganById = async (req, res, next) => {

    const id_user = req.session.user.id;
    const {id_ruangan} = req.params;
    const {alasan_peminjaman, tanggal_peminjaman, jam_mulai, jam_selesai} = req.body;

    try {

        const peminjam = await Peminjam.findOne({ where: {id_user: id_user} });

        if(!peminjam) {
            return res.status(404).json({ message: 'User tidak ditemukan' })      
        }

        const ruangan = await Ruangan.findOne({ where: {id_ruangan} });
        
        if(!ruangan) {
            return res.status(404).json({ message: 'Ruangan tidak ditemukan' })      
        }

        const newPeminjaman = await Peminjaman.create(
            {
                id_peminjam: peminjam.id_peminjam,
                id_admin: null,
                tanggal_pengajuan: new Date().toLocaleDateString(),
                alasan_peminjaman: alasan_peminjaman,
                tanggal_keputusan: null,
                status_peminjaman: 'Menunggu',
                alasan_penolakan: null,
                tanggal_pengembalian: null
            }
        )

        const newDetailPeminjaman = await DetailPeminjaman.create(
            {
                id_peminjaman: newPeminjaman.id_peminjaman,
                id_ruangan: ruangan.id_ruangan,
                tanggal_peminjaman,
                jam_mulai,
                jam_selesai
            }
        )

        return res.redirect('/data-peminjaman');

    } catch (error) {
        next(error);
    }
} 

const dataPeminjaman = async (req, res, next) => {      
    try {
        const id_user = req.session.user.id;
        const peminjam = await Peminjam.findOne({where: {id_user: id_user} });

        const peminjamans = await Peminjaman.findAll({
            where: {
                id_peminjam: peminjam.id_peminjam,
                status_peminjaman: {
                    [Op.in]: ['Menunggu', 'Diterima']
                }
            },
            attributes: ['id_peminjaman', 'alasan_peminjaman', 'status_peminjaman'],
            include: [
                {
                    model: DetailPeminjaman,
                    as: 'detail_peminjamans',
                    attributes: ['tanggal_peminjaman', 'jam_mulai', 'jam_selesai'],
                    include: [
                        {
                            model: Ruangan,
                            as: 'ruangan',
                            attributes: ['nama_ruangan'],
                            include: [
                                {
                                    model: Gedung,
                                    as: 'gedung',
                                    attributes: ['nama_gedung']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.render('User/data-peminjaman', {title: 'Data Peminjaman', peminjamans})
    } catch (error) {
        next(error);
    }

}

const batalPeminjaman = async (req, res, next) => {

    const {id_peminjaman} = req.params;

    try {
        const peminjaman = await Peminjaman.findOne(
            {
                where: {id_peminjaman}
            }
        )

        if (!peminjaman) {
            return res.status(404).json({ message: 'Peminjaman tidak ditemukan!' });
        } else {
            await peminjaman.destroy();
            return res.redirect('/data-peminjaman');
        }
    
    } catch (error) {
        next(error);
    }
}

const selesaiPeminjaman = async (req, res, next) => {
    const {id_peminjaman} = req.params;
    const id_user = req.session.user.id;

    try {
        const peminjam = await Peminjam.findOne( {where: {id_user: id_user} });
        const peminjaman = await Peminjaman.findOne(
            {
                where: {id_peminjaman, id_peminjam: peminjam.id_peminjam},
                include: {
                    model: DetailPeminjaman,
                    as: 'detail_peminjamans'
                }
            }
        )

        const detail_peminjaman = await DetailPeminjaman.findOne({ where: {id_peminjaman} });

        if (!peminjaman || !detail_peminjaman) {
            return res.status(404).json({ message: 'Peminjaman tidak ditemukan!' });
        }

        await Peminjaman.update(
            {
                status_peminjaman: 'Selesai',
                tanggal_pengembalian: new Date().toISOString()
            },
            {
                where: {id_peminjaman}
            }
        )

        await Ruangan.update(
            {
                status_ketersediaan: 'Tersedia'
            },
            {
                where: {id_ruangan: detail_peminjaman.id_ruangan}
            }
        )
        
        res.redirect('/data-peminjaman');
    } catch (error) {
        next(error);
    }
}

const riwayatPeminjaman = async (req, res, next) => {
    
    const id_user = req.session.user.id;
    const peminjam = await Peminjam.findOne({ where: {id_user: id_user} });

    try {
    
        const peminjamans = await Peminjaman.findAll(
            {
                where: {
                    id_peminjam: peminjam.id_peminjam,
                    status_peminjaman: {[Op.in]: ['Ditolak', 'Selesai']}
                },
                attributes: [
                    'id_peminjaman', 'alasan_peminjaman', 'tanggal_pengajuan', 'status_peminjaman',
                    'tanggal_keputusan', 'alasan_penolakan', 'tanggal_pengembalian'
                ],
                include: [
                    {
                        model: DetailPeminjaman,
                        as: 'detail_peminjamans',
                        attributes: ['tanggal_peminjaman', 'jam_mulai', 'jam_selesai'],
                        include: [
                            {
                                model: Ruangan,
                                as: 'ruangan',
                                attributes: ['nama_ruangan'],
                                include: [
                                    {
                                        model: Gedung,
                                        as: 'gedung',
                                        attributes: ['nama_gedung']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )

        res.render('User/riwayat-peminjaman', {title:'Rekap Peminjaman', peminjamans})
    
    } catch (error) {
        next(error)
    } 

}

module.exports = {
    home,
    profil,
    ubahProfilForm,
    ubahProfil,
    ubahPasswordForm,
    ubahPassword,
    daftarGedung,
    daftarRuangan,
    pinjamRuanganForm,
    pinjamRuanganFormById,
    pinjamRuanganById,
    pinjamRuangan,
    dataPeminjaman,
    batalPeminjaman,
    selesaiPeminjaman,
    riwayatPeminjaman
}