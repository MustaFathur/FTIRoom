const { where } = require('sequelize');
const { User } = require('../models');
var session = require('express-session');   

const authMiddleware = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({message: "Anda belum login"});
    }
    next();
}

const roleMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            const userData = await User.findOne({where: {id: req.session.user.id}});

            if (!userData) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            const userRole = userData.role;


            if (!roles.includes(userRole)) {
                return res.status(403).json({message: "Anda tidak memiliki akses"});
            }
                // if(req.includes(roleName) === 'admin') {
                //     return res.redirect('/admin/dashboard');
                // } else if (req.session.user.role === 'peminjam') {
                //     return res.redirect('/home');
                // }
            next();
        }

        catch (error) {
            return res.status(403).json({message: "Anda tidak memiliki akses"});
        }
    }   
};

const loginMiddleware = async (req, res, next) => {

    const currentUser = req.session.user;

    try {

        if(!currentUser) {
            return next();
        }

        if (currentUser.role === "admin") {
            return res.redirect('/admin/dashboard');
        } else if (currentUser.role === "peminjam") {
            return res.redirect('/home');
        }

    } catch (error) {
        console.log(error);
        return next();
    }

};

module.exports = {
    authMiddleware,
    roleMiddleware,
    loginMiddleware
};