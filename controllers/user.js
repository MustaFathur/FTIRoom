const {User, Peminjam, Gedung, Ruangan} = require('../models');
const gedung = require('../models/gedung');
const ruangan = require('../models/ruangan');

const home = (req, res) => {
    res.render('User/home', {title: 'Home'});
}

const profile = async (req, res, next) => {
    res.render
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

module.exports = {
    home,
    profile,
    daftarGedung,
    daftarRuangan
}