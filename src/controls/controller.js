import { name } from 'ejs';
import con from '../../database.js';

export const getHomepage = (req, res) => {
    res.render('index');
}


export const getRegister = (req, res) => {
    res.render('register');
}

export const regQuery = (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let searchQry = (`SELECT * FROM details WHERE name = "${user}"`);
    let qry = (`INSERT INTO details (name, password) VALUES ("${user}", "${pass}")`);
    con.query(searchQry, function (err, result) {
        if (err) {
            req.flash('warn', 'Failed to register!!');
            res.redirect('/register');
        }
        if (result.length !== 0) {
            req.flash('warn', 'user already exists!!');
            res.redirect('/register');

        } else {
            con.query(qry, function (err, results) {
                if (err) throw err;
                console.log("Registered Successfully!!");
                req.flash('success', 'User Added Successfully');
                res.redirect('/register');
            });
        }
    });
}


export const getLogin = (req, res) => {
    res.render('login');
}

export const logQuery = (req, res) => {
    let us = req.body.client;
    let ps = req.body.secure;
    if (us && ps) {
        let compareQry = (`SELECT * FROM details WHERE name = "${us}" AND password = ${ps}`);
        con.query(compareQry, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length <= 0) {
                req.flash('warn', 'Invalid Credentials!!!')
                res.redirect("/login");
            } else {
                console.log("true");
                req.session.loggedin = true;
                req.session.name = name;
                req.flash('success', 'Login Successfull');
                res.redirect('/admin');
            }
        });
    } else {
        req.flash('warn', 'Enter Details');
    }
}

export const getAdmin = (req, res) => {
    res.render('admin');
}

export const updateUser = (req, res) => {
    let n_ame = req.body.n_ame;
    let p_ass = req.body.p_ass;
    let sQry = (`SELECT * FROM details WHERE name = "${n_ame}"`);
    let updateQuery = (`UPDATE details SET password = ${p_ass} WHERE name = "${n_ame}" `);
    con.query(sQry, function (err, result) {
        if (err) {
            req.flash('warn', 'Failed to update!!');
            res.redirect('/admin');
        }
        if (result.length == 0) {
            req.flash('warn', 'record does not exists!!');
            res.redirect('/admin');
        } else {
            con.query(updateQuery, function (err, results) {
                if (err) throw err;
                console.log("true");
                req.flash('success', 'Record updated Successfully');
                res.redirect('/admin');
            });
        }
    });
}
