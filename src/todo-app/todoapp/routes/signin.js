const express = require('express');
const router = express.Router();
const passport = require('passport');
const title = 'Sign ip';

router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const flashMessages = req.flash().error;
  const errorMessage = [];
  
  if(typeof flashMessages !== 'undefined') {
    for(let flashMessage of flashMessages) {
      errorMessage.push(flashMessage);
    };
  };
  
  if(isAuth) { res.redirect('/'); };
  res.render('signin', {
    title: title,
    isAuth: isAuth,
    errorMessage: errorMessage,
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  }
));

module.exports = router;