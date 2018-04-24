module.exports = {
    checkDb: (req, res, next) => {
        const db = app.get('db');            
            if (db) {
                req.db = db;
                return db
            }
            else {
                res.status(500).send({ message: 'database not connected' });
            }
    },
}