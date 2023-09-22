const config = require('../configs/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

// note :
// pid = profile id
// img = image
// dsc = description
// pro = profession
// lsc = link socmed
// loc = location

module.exports = {
    // get all about
    getDataAbout(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM abouts WHERE status = 1 ORDER BY profile_id ASC;`
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

    // get data about by ID
    getDataAboutByID(req, res) {
        const pid = req.params.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM abouts WHERE profile_id = ? AND status = 1;`, [pid],
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
        })
    },

    // save data about
    addDataAbout(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM abouts WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    let data = [pid,req.body.img,req.body.dsc,req.body.pro,req.body.lsc,req.body.loc];

                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `INSERT INTO abouts (profile_id, img, description, profession, link_socmed, location) VALUES (?);`, [data],
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

    // update data about
    editDataAbout(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM abouts WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    const img = (req.body.img == null) ? results[0]['img'] : req.body.img;
                    const dsc = (req.body.dsc == null) ? results[0]['description'] : req.body.dsc;
                    const pro = (req.body.pro == null) ? results[0]['profession'] : req.body.pro;
                    const lsc = (req.body.lsc == null) ? results[0]['link_socmed'] : req.body.lsc;
                    const loc = (req.body.loc == null) ? results[0]['location'] : req.body.loc;
                    
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE abouts SET img = ?, description = ?, profession = ?, link_socmed = ?, location = ? WHERE profile_id = ?;`, [img, dsc, pro, lsc, loc, pid],
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

    // delete data about
    deleteDataAbout(req, res) {
        const pid = req.body.pid;
        const pid_del = '-'+pid+'-';
        const stt = 0;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM abouts WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE abouts SET profile_id = ?, status = ? WHERE profile_id = ?;`, [pid_del, stt, pid],
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