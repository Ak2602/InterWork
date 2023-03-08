import { name } from 'ejs';
import con from '../../database.js';

export const getLogin = (req, res) => {
    res.render('login');
}

export const logQuery = (req, res) => {
    let us = req.body.client;
    let ps = req.body.secure;
    if (us && ps) {
        let compareQry = (`SELECT * FROM details WHERE name = "${us}" AND password = "${ps}"`);
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