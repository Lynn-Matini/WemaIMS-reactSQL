import mysql from 'mysql';

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wema',
});

con.connect((err) => {
  if (err) {
    console.log('Connection error', err.message);
  } else {
    console.log('Connected!');
  }
});

export default con;
