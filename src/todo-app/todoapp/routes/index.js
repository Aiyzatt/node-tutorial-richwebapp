const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const title = 'Todo App';

/* GET home page. */
router.get('/', function(req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = (typeof req.user !== 'undefined') ? req.user.id : null;

  knex('tasks')
    .select('*')
    .where({
      user_id: userId,
    })
    .then((results) => {
      console.log(results);
      res.render('index', {
        title: title,
        todos: results,
        isAuth: isAuth,
        userId: userId,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render('index', {
        title: title,
        isAuth: isAuth,
      });
    });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todo = req.body.todo;

  knex('tasks')
    .insert({
      user_id: userId,
      content: todo,
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
      res.render('index', {
        title: title,
        isAuth: isAuth,
      });
    });
});

/* app.jsの肥大化を避けるためにindex.jsに記述 */
router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;
