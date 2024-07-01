const { where } = require('sequelize');
const { User, Peminjam } = require('../models');
const bcrypt = require('bcryptjs');

const registerForm = (req, res) => {
    res.render('register', {title : "Register"});
}
 
const register = async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const no_hp = req.body.no_hp;

        let message = null;
        let messageType = null;

        if(!username || !email || !password || !no_hp) {
            message = "Semua data harus diisi";
            messageType = "error";
            req.flash('message', message);
            req.flash('messageType', messageType);
            return res.redirect('/auth/register');
        }

        if(password.length < 6) {
            message = "Password harus lebih dari 6 karakter";
            messageType = "error";
            req.flash('message', message);
            req.flash('messageType', messageType);
            return res.redirect('/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username, 
            email,
            password: hashedPassword,
            no_hp,
            role: 'peminjam'
        });

        const newPeminjam = await Peminjam.create({
            id_user: newUser.id
        });

        if(!newPeminjam){
            message = "Gagal membuat user";
            messageType = "error";
        } else {
            message = "Registrasi berhasil!";
            messageType = "success";
        }

        req.flash('message', message);
        req.flash('messageType', messageType);
        res.redirect('/auth/register');

    } catch (error) {
        req.flash('message', error.message);
        req.flash('messageType', "error");
        res.redirect('/auth/register');
    }
}

const loginForm = (req, res) => {
    res.render('login', {title : "Login"});
}

const login = async (req, res) => {
    try {
        const emailOrUsername = req.body.emailOrUsername;
        const password = req.body.password;

        let message = null;
        let messageType = null;

        if(!emailOrUsername || !password) {
            message = "Email atau username dan password harus diisi";
            messageType = "error";
            req.flash('message', message);
            req.flash('messageType', messageType);
            return res.redirect('/auth/login');
        }

        const isEmail = emailOrUsername.includes('@');
        const user = isEmail ? await User.findOne({where: {email: emailOrUsername}}) : await User.findOne({where: {username: emailOrUsername}})
        
        if(!user) {
            message = "User tidak ditemukan";
            messageType = "error";
            req.flash('message', message);
            req.flash('messageType', messageType);
            return res.redirect('/auth/login');
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword) {
            message = "Password salah";
            messageType = "error";
            req.flash('message', message);
            req.flash('messageType', messageType);
            return res.redirect('/auth/login');
        }   

        req.session.user = {id: user.id, role: user.role};

        if(user.role === 'admin') {
            return res.redirect('/admin/dashboard')
        } else if(user.role === 'peminjam') {
            return res.redirect('/home')
        }
    } catch (error) {
        req.flash('message', error.message);
        req.flash('messageType', "error");
        res.redirect('/auth/login');
    }
}

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({message: err.message});
        return res.redirect('/auth/login');
    })
}

module.exports = {
    registerForm, 
    register, 
    loginForm,
    login, 
    logout 
};