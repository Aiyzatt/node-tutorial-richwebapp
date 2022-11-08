const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db', // docker-compose.ymlで定義
  user: 'root',
  password: 'password',
  database: 'todo_app',
  stringifyObjects: true, // Objectによるsqlインジェクションの防止
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const user_id = 1;
  const sql = 'select * from tasks where user_id = ?';
  const placeholder =  [user_id];
  connection.query(sql, placeholder, (error, results) => {
    console.log(error);
    console.log(results);
    res.render('index', {
      title: 'Todo App',
      todos: results,
    });
  });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return
    }
    console.log('success');
  });

  const user_id = 1;
  const todo = req.body.todo;
  const sql = 'insert into tasks (user_id, content) values (?, ?)';
  const placeholder = [user_id, todo];
  connection.query(sql, placeholder, (error, results) => {
    console.log(error);
    res.redirect('/');
  });
});

module.exports = router;
