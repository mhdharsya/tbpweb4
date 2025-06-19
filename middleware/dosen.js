
const dosenMiddleware = (req, res, next) => {
   
    if (req.user && req.user.role === 'dosen') {
        return next();
    } else {
        return res.status(403).json({ message: "Akses ditolak. Sumber daya ini hanya untuk dosen." });

    }
};

module.exports = dosenMiddleware;