import mysql from "mysql2";

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Ak@260602",
    database:"wrkdb"
});

con.connect(function(err){
    if (err){
        console.log("Connection Failed");
    }else{
        console.log("connected");
    }
});
export default con;