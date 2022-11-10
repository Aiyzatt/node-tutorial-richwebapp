const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const title = 'Sign up';

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  if(isAuth) { res.redirect('/'); };

  res.render('signup', {
    title: title,
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  knex('users')
    .select('*')
    .where('name', username)
    .then(async (results) => {
      if(results.length !== 0) {
        res.render('signup', {
          title: title,
          isAuth: isAuth,
          errorMessage: ['このユーザ名は既に使われています'],
        });
      } else if(password !== repassword) {
        res.render('signup', {
          title: title,
          isAuth: isAuth,
          errorMessage: ['パスワードが一致しません'],
        });
      } else { // バリデーションクリアの場合
        const hashedPassword = await bcrypt.hash(password, 10);
        knex('users')
          .insert({name: username, password: hashedPassword})
          .then((results) => {
            req.session.userid = results[0];
            res.redirect('/');
          })
          .catch((error) => {
            console.error(error);
            res.render('signup', {
              title: title,
              isAuth: isAuth,
              errorMessage: [error.sqlMessage],
            });
          });
      }
    })
    .catch((error) => {
      console.log('error');
      res.render('signup', {
        title: title,
        isAuth, isAuth,
        errorMessage: [error.sqlMessage],
      });
    });
});

module.exports = router;