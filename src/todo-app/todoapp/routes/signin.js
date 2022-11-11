const express = require('express');
const router = express.Router();
const passport = require('passport');
const title = 'Sign ip';

router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if(isAuth) { res.redirect('/'); };
  res.render('signin', {
    title: title,
    isAuth: isAuth,
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  }
));

module.exports = router;