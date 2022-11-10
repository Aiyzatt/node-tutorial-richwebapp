const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
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
    })
    .then(async (results) => {
      if(results.length === 0) {
        res.render('signin', {
          title: title,
          isAuth, isAuth,
          errorMessage: ['ユーザ名かパスワード、またはその両方に誤りがあります'],
        });
      } else { // 認証OKの場合
        if(await bcrypt.compare(password, results[0].password)) {
          req.session.userid = results[0].id;
          res.redirect('/');
        } else {
          res.render('signin', {
            title: title,
            isAuth, isAuth,
            errorMessage: ['ユーザ名かパスワード、またはその両方に誤りがあります'],
          });
        }
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