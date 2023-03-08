import con from '../../database.js';

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


