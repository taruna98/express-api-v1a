const config = require('../configs/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

// note :
// pid = profile id
// nck = nickname
// fnm = fullname
// dsc = description
// img = image
// lnk = link
// ptl = pro title
// pdc = pro description

module.exports = {
    // get all data profile
    getDataProfile(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM profiles WHERE status = 1 ORDER BY profile_id ASC;`
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
        })
    },

    // get data profile by profile id
    getDataProfileByID(req, res) {
        const profile_id = req.params.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM profiles WHERE profile_id = ? AND status = 1;`, [profile_id],
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

    // save data profile
    addDataProfile(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM profiles WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    let data = [pid,req.body.nck,req.body.fnm,req.body.dsc,req.body.img,req.body.lnk,req.body.ptl,req.body.pdc];

                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `INSERT INTO profiles (profile_id, home_nck, home_fnm, home_desc, home_img, home_link, home_pro_title, home_pro_desc) VALUES (?);`, [data],
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

    // update data profile
    editDataProfile(req, res) {
        const pid = req.body.pid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM profiles WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    const nck = (req.body.nck == null) ? results[0]['home_nck'] : req.body.nck; 
                    const fnm = (req.body.fnm == null) ? results[0]['home_fnm'] : req.body.fnm; 
                    const dsc = (req.body.dsc == null) ? results[0]['home_desc'] : req.body.dsc; 
                    const img = (req.body.img == null) ? results[0]['home_img'] : req.body.img; 
                    const lnk = (req.body.lnk == null) ? results[0]['home_link'] : req.body.lnk;
                    const ptl = (req.body.ptl == null) ? results[0]['home_pro_title'] : req.body.ptl; 
                    const pdc = (req.body.pdc == null) ? results[0]['home_pro_desc'] : req.body.pdc;

                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE profiles SET home_nck = ?, home_fnm = ?, home_desc = ?, home_img = ?, home_link = ?, home_pro_title = ?, home_pro_desc = ? WHERE profile_id = ?;`, [nck, fnm, dsc, img, lnk, ptl, pdc, pid],
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

    // delete data profile
    deleteDataProfile(req, res) {
        const pid = req.body.pid;
        const pid_del = '-'+pid+'-';
        const stt = 0;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM profiles WHERE profile_id = ? AND status = 1;`, pid,
                function (error, results) {
                    if(error) throw error;
                if(results == '') {
                    res.status(403).send("profile id not exist");
                } else {
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `UPDATE profiles SET profile_id = ?, status = ? WHERE profile_id = ?;`, [pid_del, stt, pid],
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