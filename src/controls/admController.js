import con from "../../database.js";

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