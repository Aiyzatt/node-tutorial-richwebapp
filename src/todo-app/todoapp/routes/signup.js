const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const title = 'Sign up';

router.get('/', function (req, res, next) {
  res.render('signup', {
    title: title,
  });
});

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  knex('users')
    .select('*')
    .where('name', username)
    .then((results) => {
      if(results.length !== 0) {
        res.render('signup', {
          title: title,
          errorMessage: ['このユーザ名は既に使われています'],
        });
      } else if(password !== repassword) {
        res.render('signup', {
          title: title,
          errorMessage: ['パスワードが一致しません'],
        });
      } else { // バリデーションクリアの場合
        knex('users')
          .insert({name: username, password: password})
          .then(() => {
            res.redirect('/');
          })
          .catch((error) => {
            console.error(error);
            res.render('signup', {
              title: title,
              errorMessage: [error.sqlMessage],
            });
          });
      }
    })
    .catch((error) => {
      console.log('error');
      res.render('signup', {
        title: title,
        errorMessage: error.sqlMessage,
      });
    });
});

module.exports = router;