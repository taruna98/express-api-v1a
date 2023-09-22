const config = require('../configs/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

// note
// pid = profile id
// ttl = title
// dsc = description
// lnk = link
// img = image

module.exports = {
    // get all portfolio
    getDataPortfolio(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM portfolios WHERE status = 1 ORDER BY profile_id ASC;`
            , function (error, results) {
                if(error) throw error; 
                if(results == '') {
                    res.status(404).send("data not found");
                } else {
                    res.send({ 
                        success: true, 
                        message: 'success get all data',
                        data: results
                    });
                }
            });
            connection.release();
        });
    },

    // get data portfolio by ID
    getDataPortfolioByID(req, res) {
        const pid = req.params.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM portfolios WHERE profile_id = ? AND status = 1;`, [pid],
            function (error, results) {
                if(error) throw error;  
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    res.send({ 
                        success: true, 
                        message: 'success get data',
                        data: results
                    });
                }
            });
            connection.end();
        });
    },

    // save data portfolio
    addDataPortfolio(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM portfolios WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    let data = [pid,req.body.ttl,req.body.dsc,req.body.lnk,req.body.img];

                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `INSERT INTO portfolios (profile_id, title, description, link, img) VALUES (?);`, [data],
                        function (error, results) {
                            if(error) throw error;  
                            res.send({ 
                                success: true, 
                                message: 'success add data',
                            });
                        });
                        connection.release();
                    });
                } else {
                    res.status(403).send("profile id is exist");
                }
            });
            connection.release();
        });
    },

    // update data portfolio
    editDataPortfolio(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM portfolios WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    const ttl = (req.body.ttl == null) ? results[0]['title'] : req.body.ttl;
                    const dsc = (req.body.dsc == null) ? results[0]['description'] : req.body.dsc;
                    const lnk = (req.body.lnk == null) ? results[0]['link'] : req.body.lnk;
                    const img = (req.body.img == null) ? results[0]['img'] : req.body.img;
                    
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE portfolios SET title = ?, description = ?, link = ?, img = ? WHERE profile_id = ?;`, [ttl, dsc, lnk, img, pid],
                        function (error, results) {
                            if(error) throw error;  
                            res.send({ 
                                success: true, 
                                message: 'success edit data',
                            });
                        });
                        connection.release();
                    });
                }
            });
            connection.release();
        });
    },

    // delete data portfolio
    deleteDataPortfolio(req, res) {
        const pid = req.body.pid;
        const pid_del = '-'+pid+'-';
        const stt = 0;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM portfolios WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE portfolios SET profile_id = ?, status = ? WHERE profile_id = ?;`, [pid_del, stt, pid],
                        function (error, results) {
                            if(error) throw error;  
                            res.send({ 
                                success: true, 
                                message: 'success delete data'
                            });
                        });
                        connection.release();
                    });
                }
            });
            connection.release();
        });
    }
}