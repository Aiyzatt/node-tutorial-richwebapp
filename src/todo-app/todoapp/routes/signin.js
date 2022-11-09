const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const title = 'Sign ip';

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  if(isAuth) { res.redirect('/'); };
  res.render('signin', {
    title: title,
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const username = req.body.username;
  const password = req.body.password;

  knex('users')
    .select('*')
    .where({
      name: username,
      password: password,
    })
    .then((results) => {
      if(results.length === 0) {
        res.render('signin', {
          title: title,
          isAuth, isAuth,
          errorMessage: ["ユーザが見つかりません"],
        });
      } else { // 認証OKの場合
        req.session.userid = results[0].id;
        res.redirect('/');
      }
    })
    .catch((error) => {
      console.log(error);
      res.render('signin', {
        title: title,
        errorMessage: [error.sqlMessage],
        isAuth: false,
      });
    });
});

module.exports = router;