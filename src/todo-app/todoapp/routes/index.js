const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const title = 'Todo App';

/* GET home page. */
router.get('/', function(req, res, next) {
  const user_id = 2;
  knex('tasks')
    .select('*')
    .where('user_id', user_id)
    .then((results) => {
      console.log(results);
      res.render('index', {
        title: title,
        todos: results,
        user_id: user_id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render('index', {
        title: title,
      });
    });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  const user_id = req.body.user_id;
  const todo = req.body.todo;
  knex('tasks')
    .insert({
      user_id: user_id,
      content: todo,
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
      res.render('index', {
        title: title,
      });
    });
});

module.exports = router;
